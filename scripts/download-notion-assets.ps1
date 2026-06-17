$ErrorActionPreference = "Stop"
$signApi = "https://cerulean-act-73f.notion.site/api/v3/getSignedFileUrls"
$chunkApi = "https://cerulean-act-73f.notion.site/api/v3/loadPageChunk"
$contentPath = Join-Path $PSScriptRoot "..\src\data\notion-content.json"
$assetsRoot = Join-Path $PSScriptRoot "..\public\assets"

$pageMap = @{
    "3746b680-64b8-8034-9e46-c4ae7a46cc85" = "harvey-park"
    "3256b680-64b8-8092-b7f7-db8b5a18c00d" = "birth-of-miracle"
    "3256b680-64b8-8013-968a-fafefb647147" = "miracle-born-dead"
    "3256b680-64b8-802d-9f70-c29121044cdd" = "dekrawler"
    "3296b680-64b8-80dd-8d3a-c73659ceef40" = "miracle-board-game"
    "3296b680-64b8-803c-ace7-df4b17f24453" = "moods-of-istanbul"
    "3256b680-64b8-8076-b405-ee43261c67e4" = "mikapoly"
    "3296b680-64b8-8051-9664-d3f2498885d7" = "sown-in-silence"
    "3296b680-64b8-80c4-a4e4-fa4c42dc4c52" = "gears-of-behemoth"
    "3296b680-64b8-805c-9e8b-e87aff194657" = "dissonance-ward"
    "3296b680-64b8-800a-b35d-d75eae4c5914" = "idle-incrementation"
    "3296b680-64b8-8017-9c5f-d088ea7ca2a7" = "human-vs-ai"
    "3826b680-64b8-809b-b20f-f12e32d62f43" = "player-thoughts-review"
    "3826b680-64b8-80b1-89d7-db4d2699db13" = "settlers-of-catan"
    "3826b680-64b8-801f-ad3d-d3bb9a69d3a8" = "bartle-poe"
}

function Get-BlockValue($entry) {
    if (-not $entry) { return $null }
    $v = $entry.value
    if ($v -and $v.value) { return $v.value }
    return $v
}

function Fetch-AllBlocks($pageId) {
    $blocks = @{}
    for ($i = 0; $i -lt 30; $i++) {
        try {
            $body = @{ pageId = $pageId; limit = 100; cursor = @{ stack = @() }; chunkNumber = $i; verticalColumns = $false } | ConvertTo-Json -Compress
            $r = Invoke-RestMethod -Uri $chunkApi -Method POST -ContentType "application/json" -Body $body
            if (-not $r.recordMap.block) { break }
            foreach ($p in $r.recordMap.block.PSObject.Properties) { $blocks[$p.Name] = $p.Value }
        } catch { break }
    }
    # Load lazy children for headers/toggles
    $headerIds = @()
    foreach ($id in @($blocks.Keys)) {
        $b = Get-BlockValue $blocks[$id]
        if ($b -and $b.content -and $b.content.Count -gt 0 -and $b.type -in @("header", "sub_header", "toggle", "page")) {
            $headerIds += $b.id
        }
    }
    foreach ($hid in $headerIds) {
        for ($i = 0; $i -lt 10; $i++) {
            try {
                $body = @{ pageId = $hid; limit = 100; cursor = @{ stack = @() }; chunkNumber = $i; verticalColumns = $false } | ConvertTo-Json -Compress
                $r = Invoke-RestMethod -Uri $chunkApi -Method POST -ContentType "application/json" -Body $body
                if (-not $r.recordMap.block) { break }
                foreach ($p in $r.recordMap.block.PSObject.Properties) { $blocks[$p.Name] = $p.Value }
            } catch { break }
        }
    }
    return $blocks
}

function Get-AttachmentRef($block) {
    if ($block.properties.source) {
        $src = $block.properties.source[0][0]
        if ($src) { return $src }
    }
    if ($block.format.display_source) { return $block.format.display_source }
    return $null
}

function Sanitize-Filename($name) {
    $name = $name -replace '[<>:"/\\|?*]', '_'
    if ($name.Length -gt 120) { $name = $name.Substring(0, 120) }
    return $name
}

function Get-SignedUrl($attachment, $blockId) {
    if ($attachment -match '^https?://') { return $attachment }
    $body = @{
        urls = @(@{
            url = $attachment
            permissionRecord = @{ table = "block"; id = $blockId }
        })
    } | ConvertTo-Json -Depth 6 -Compress
    $r = Invoke-RestMethod -Uri $signApi -Method POST -ContentType "application/json" -Body $body
    return $r.signedUrls[0]
}

function Download-Asset($signedUrl, $destPath) {
    $dir = Split-Path $destPath -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    if (Test-Path $destPath) { return }
    Invoke-WebRequest -Uri $signedUrl -OutFile $destPath -UseBasicParsing
}

function Resolve-LocalAsset($slug, $attachment, $blockId, $filename) {
    $safeName = Sanitize-Filename $filename
    $destDir = Join-Path $assetsRoot $slug
    $destPath = Join-Path $destDir $safeName
    $publicPath = "/assets/$slug/$safeName"
    try {
        $signed = Get-SignedUrl $attachment $blockId
        Download-Asset $signed $destPath
        Start-Sleep -Milliseconds 150
        return $publicPath
    } catch {
        Write-Warning "Failed download $slug/$safeName : $_"
        return $null
    }
}

function Walk-Content($blocks, $slug, [ref]$content) {
    if (-not $content.Value) { return }
    $updated = @()
    foreach ($block in $content.Value) {
        $b = @{}
        $block.PSObject.Properties | ForEach-Object { $b[$_.Name] = $_.Value }

        if ($b.type -in @("pdf", "image", "file") -and $b.url -and $b.url -match '^attachment:') {
            $fname = if ($b.text) { $b.text } else { "file" }
            $local = Resolve-LocalAsset $slug $b.url $b.blockId $fname
            if ($local) { $b.url = $local } else { $b.url = $null }
        }

        if ($b.children) {
            $children = $b.children
            Walk-Content $blocks $slug ([ref]$children)
            $b.children = $children
        }
        $updated += $b
    }
    $content.Value = $updated
}

# Load existing content
$content = Get-Content $contentPath -Raw -Encoding UTF8 | ConvertFrom-Json

foreach ($kv in $pageMap.GetEnumerator()) {
    $pageId = $kv.Key
    $slug = $kv.Value
    Write-Host "Assets: $slug"

    $allBlocks = Fetch-AllBlocks $pageId
    $pageBlock = Get-BlockValue $allBlocks[$pageId]

    # Cover image
  if ($pageBlock.format.page_cover) {
        $coverRef = $pageBlock.format.page_cover
        if ($coverRef -match '^attachment:') {
            $coverName = if ($coverRef -match ':([^:]+)$') { "cover-$($matches[1])" } else { "cover.jpg" }
            $localCover = Resolve-LocalAsset $slug $coverRef $pageId $coverName
            if ($localCover) {
                $content.$slug | Add-Member -NotePropertyName coverImage -NotePropertyValue $localCover -Force
            }
        } elseif ($coverRef -match '^/images/') {
            $content.$slug | Add-Member -NotePropertyName coverImage -NotePropertyValue "https://cerulean-act-73f.notion.site$coverRef" -Force
        }
    }

    # Map attachment refs from API blocks into content by matching text/type
    $mediaBlocks = @()
    foreach ($id in $allBlocks.Keys) {
        $b = Get-BlockValue $allBlocks[$id]
        if ($b.type -in @("pdf", "image", "file")) {
            $ref = Get-AttachmentRef $b
            $title = ""
            if ($b.properties.title -and $b.properties.title[0]) { $title = $b.properties.title[0][0] }
            if ($ref) {
                $mediaBlocks += [PSCustomObject]@{ id = $b.id; type = $b.type; ref = $ref; text = $title; used = $false }
            }
        }
    }

    # Enrich content blocks with attachment refs + blockIds, then download
    function Enrich-And-Walk([ref]$items) {
        if (-not $items.Value) { return }
        $out = @()
        foreach ($block in $items.Value) {
            $b = @{}
            $block.PSObject.Properties | ForEach-Object { $b[$_.Name] = $_.Value }

            if ($b.type -in @("pdf", "image", "file")) {
                $match = $null
                if ($b.url -match '^attachment:') {
                    $match = $mediaBlocks | Where-Object { $_.ref -eq $b.url } | Select-Object -First 1
                    $blockId = if ($b.blockId) { $b.blockId } elseif ($match) { $match.id } else { $pageId }
                    $fname = if ($b.text -and $b.text -ne "image.png") { $b.text } elseif ($match -and $match.text) { $match.text } else { "file-$blockId" }
                    $local = Resolve-LocalAsset $slug $b.url $blockId $fname
                    if ($local) { $b.url = $local }
                    if ($match) { $match.used = $true }
                } else {
                    if ($b.text) {
                        $match = $mediaBlocks | Where-Object { $_.type -eq $b.type -and $_.text -eq $b.text -and -not $_.used } | Select-Object -First 1
                    }
                    if (-not $match) {
                        $match = $mediaBlocks | Where-Object { $_.type -eq $b.type -and -not $_.used } | Select-Object -First 1
                    }
                    if ($match) {
                        $b.blockId = $match.id
                        $fname = if ($b.text -and $b.text -ne "image.png") { $b.text } else { $match.text }
                        if (-not $fname -or $fname -eq "image.png") {
                            $fname = if ($match.text -and $match.text -ne "image.png") { $match.text } else { "image-$($match.id.Substring(0,8)).png" }
                        }
                        $local = Resolve-LocalAsset $slug $match.ref $match.id $fname
                        if ($local) { $b.url = $local }
                        $match.used = $true
                    }
                }
            }

            if ($b.children) {
                $ch = $b.children
                Enrich-And-Walk ([ref]$ch)
                $b.children = $ch
            }
            $out += $b
        }
        $items.Value = $out
    }

    $pageContent = $content.$slug.content
    Enrich-And-Walk ([ref]$pageContent)
    $content.$slug | Add-Member -NotePropertyName content -NotePropertyValue $pageContent -Force
}

$content | ConvertTo-Json -Depth 25 | Out-File $contentPath -Encoding utf8
Write-Host "Done. Assets saved to public/assets/"
