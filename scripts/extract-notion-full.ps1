$ErrorActionPreference = "Stop"
$base = "https://cerulean-act-73f.notion.site/api/v3/loadPageChunk"

function Get-RichText($titleParts) {
    if (-not $titleParts) { return "" }
    $out = ""
    foreach ($part in $titleParts) {
        if ($part -is [string]) {
            $out += $part
        } elseif ($part -is [array] -and $part.Count -gt 0 -and $part[0] -is [string]) {
            $out += $part[0]
        }
    }
    return $out.Trim()
}

function Get-BlockValue($entry) {
    if (-not $entry) { return $null }
    $v = $entry.value
    if ($v -and $v.value) { return $v.value }
    return $v
}

function Fetch-PageChunk($pageId, $chunkNumber = 0) {
    $body = @{
        pageId = $pageId
        limit = 100
        cursor = @{ stack = @() }
        chunkNumber = $chunkNumber
        verticalColumns = $false
    } | ConvertTo-Json -Depth 6 -Compress
    return Invoke-RestMethod -Uri $base -Method POST -ContentType "application/json" -Body $body
}

function Merge-RecordMap($allData, $data) {
    if ($data.recordMap.block) {
        foreach ($prop in $data.recordMap.block.PSObject.Properties) {
            $allData.blocks[$prop.Name] = $prop.Value
        }
    }
    if ($data.recordMap.collection_view) {
        foreach ($prop in $data.recordMap.collection_view.PSObject.Properties) {
            $allData.collectionViews[$prop.Name] = $prop.Value
        }
    }
}

function Fetch-AllBlocks($pageId) {
    $allData = @{ blocks = @{}; collectionViews = @{} }
    for ($i = 0; $i -lt 30; $i++) {
        try {
            $data = Fetch-PageChunk -pageId $pageId -chunkNumber $i
            if (-not $data.recordMap.block) { break }
            Merge-RecordMap $allData $data
        } catch {
            break
        }
    }
    return $allData
}

function Needs-ChildFetch($childId, $allData) {
    if (-not $allData.blocks[$childId]) { return $true }
    $child = Get-BlockValue $allData.blocks[$childId]
    if (-not $child) { return $true }
    if ($child.type -in @("text", "bulleted_list", "numbered_list", "header", "sub_header", "sub_sub_header")) {
        if (-not (Get-RichText $child.properties.title)) { return $true }
    }
    return $false
}

function Ensure-ChildrenLoaded($blockId, $allData) {
    $block = Get-BlockValue $allData.blocks[$blockId]
    if (-not $block -or -not $block.content -or $block.content.Count -eq 0) { return }

    $needsLoad = $false
    foreach ($childId in $block.content) {
        if (Needs-ChildFetch $childId $allData) { $needsLoad = $true; break }
    }

    if ($needsLoad) {
        for ($i = 0; $i -lt 15; $i++) {
            try {
                $data = Fetch-PageChunk -pageId $blockId -chunkNumber $i
                Merge-RecordMap $allData $data
            } catch { break }
        }
    }

    foreach ($childId in $block.content) {
        $child = Get-BlockValue $allData.blocks[$childId]
        if ($child -and $child.content -and $child.content.Count -gt 0) {
            Ensure-ChildrenLoaded $childId $allData
        }
    }
}

function Get-AttachmentRef($block) {
    if ($block.properties.source) {
        $src = $block.properties.source[0][0]
        if ($src) { return $src }
    }
    if ($block.format -and $block.format.display_source) {
        return $block.format.display_source
    }
    return $null
}

function Block-ToContent($blockId, $allData, [int]$depth = 0) {
    $allBlocks = $allData.blocks
    $entry = $allBlocks[$blockId]
    $block = Get-BlockValue $entry
    if (-not $block -or ($block.alive -eq $false)) { return @() }

    if ($block.content -and $block.content.Count -gt 0) {
        Ensure-ChildrenLoaded $blockId $allData
        $block = Get-BlockValue $allData.blocks[$blockId]
    }

    $type = $block.type
    $text = Get-RichText $block.properties.title
    $isToggleable = $block.format -and $block.format.toggleable -eq $true
    $items = @()

    switch ($type) {
        "header" {
            if ($isToggleable -and $block.content -and $block.content.Count -gt 0) {
                $items += @{ type = "toggle"; text = $text; level = 1 }
            } elseif ($text) {
                $items += @{ type = "heading1"; text = $text }
            }
        }
        "sub_header" {
            if ($isToggleable -and $block.content -and $block.content.Count -gt 0) {
                $items += @{ type = "toggle"; text = $text; level = 2 }
            } elseif ($text) {
                $items += @{ type = "heading2"; text = $text }
            }
        }
        "sub_sub_header" {
            if ($isToggleable -and $block.content -and $block.content.Count -gt 0) {
                $items += @{ type = "toggle"; text = $text; level = 3 }
            } elseif ($text) {
                $items += @{ type = "heading3"; text = $text }
            }
        }
        "text" { if ($text) { $items += @{ type = "paragraph"; text = $text } } }
        "bulleted_list" { if ($text) { $items += @{ type = "bullet"; text = $text } } }
        "numbered_list" { if ($text) { $items += @{ type = "numbered"; text = $text } } }
        "quote" { if ($text) { $items += @{ type = "quote"; text = $text } } }
        "callout" { if ($text) { $items += @{ type = "callout"; text = $text } } }
        "code" { if ($text) { $items += @{ type = "code"; text = $text } } }
        "divider" { $items += @{ type = "divider" } }
        "toggle" { $items += @{ type = "toggle"; text = $text } }
        "to_do" {
            $checked = $false
            if ($block.properties.checked) { $checked = [bool]$block.properties.checked[0][0] }
            $items += @{ type = "todo"; text = $text; checked = $checked }
        }
        "bookmark" {
            $url = if ($block.properties.link) { $block.properties.link[0][0] } else { $text }
            $items += @{ type = "link"; text = $text; url = $url }
        }
        "pdf" {
            $attachment = Get-AttachmentRef $block
            $items += @{ type = "pdf"; text = if ($text) { $text } else { "PDF Document" }; url = $attachment; blockId = $block.id }
        }
        "file" {
            $attachment = Get-AttachmentRef $block
            $items += @{ type = "file"; text = if ($text) { $text } else { "File" }; url = $attachment; blockId = $block.id }
        }
        "embed" {
            $url = if ($block.format.source) { $block.format.source } elseif ($block.properties.source) { $block.properties.source[0][0] } else { $text }
            $items += @{ type = "embed"; text = $text; url = $url }
        }
        "image" {
            $attachment = Get-AttachmentRef $block
            $items += @{ type = "image"; text = $text; url = $attachment; blockId = $block.id }
        }
        "table" {
            $rows = @()
            if ($block.content) {
                foreach ($rowId in $block.content) {
                    $rowBlock = Get-BlockValue $allBlocks[$rowId]
                    if ($rowBlock -and $rowBlock.type -eq "table_row") {
                        $cells = @()
                        foreach ($cell in $rowBlock.properties) {
                            $prop = $rowBlock.properties.$cell
                            if ($prop) { $cells += Get-RichText $prop }
                        }
                        if ($rowBlock.properties.PSObject.Properties) {
                            $cells = @()
                            foreach ($cp in $rowBlock.properties.PSObject.Properties) {
                                $cells += Get-RichText $cp.Value
                            }
                        }
                        if ($cells.Count -gt 0) { $rows += ,@($cells) }
                    }
                }
            }
            if ($rows.Count -gt 0) { $items += @{ type = "table"; rows = $rows } }
        }
        "column_list" { }
    }

    if ($block.content -and $type -notin @("table", "collection_view")) {
        $childItems = @()
        foreach ($childId in $block.content) {
            $childItems += Block-ToContent -blockId $childId -allData $allData -depth ($depth + 1)
        }
        if ($type -eq "toggle" -and $items.Count -gt 0) {
            $items[-1].children = $childItems
        } elseif ($isToggleable -and $type -in @("header", "sub_header", "sub_sub_header") -and $items.Count -gt 0) {
            $items[-1].children = $childItems
        } elseif ($type -in @("bulleted_list", "numbered_list") -and $items.Count -gt 0) {
            $items[-1].children = $childItems
        } elseif ($type -eq "column_list") {
            $items += $childItems
        } elseif ($type -eq "column") {
            $items += $childItems
        } else {
            $items += $childItems
        }
    }

    return $items
}

function Extract-Page($pageId) {
    $allData = Fetch-AllBlocks $pageId
    Ensure-ChildrenLoaded $pageId $allData
    $pageBlock = Get-BlockValue $allData.blocks[$pageId]
    $title = Get-RichText $pageBlock.properties.title
    $content = @()
    if ($pageBlock.content) {
        foreach ($childId in $pageBlock.content) {
            $content += Block-ToContent -blockId $childId -allData $allData
        }
    }
    return @{ title = $title; content = $content }
}

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

$results = @{}
foreach ($kv in $pageMap.GetEnumerator()) {
    Write-Host "Fetching $($kv.Value) ..."
    try {
        $results[$kv.Value] = Extract-Page -pageId $kv.Key
        Write-Host "  -> $($results[$kv.Value].content.Count) blocks"
        Start-Sleep -Milliseconds 400
    } catch {
        Write-Warning "Failed $($kv.Value): $_"
        $results[$kv.Value] = @{ title = $kv.Value; content = @(); error = $_.ToString() }
    }
}

$outPath = Join-Path $PSScriptRoot "..\src\data\notion-content.json"
$results | ConvertTo-Json -Depth 25 | Out-File $outPath -Encoding utf8
Write-Host "Saved to $outPath"
