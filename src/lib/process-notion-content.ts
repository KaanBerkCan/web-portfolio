import type { NotionBlock } from "@/types/notion";

export interface ExternalLink {
  label: string;
  url: string;
}

const URL_REGEX = /https?:\/\/[^\s\])|>]+/;
/* Projects whose itch.io link belongs at the head of the page rather than in
   the External Links block at the foot: if you can go and play it, that is the
   first thing the page should offer. */
const TOP_LINK_SLUGS = new Set([
  "harvey-park",
  "idle-incrementation",
  "dekrawler",
]);

function extractUrl(text: string): string | null {
  const match = text.match(URL_REGEX);
  return match ? match[0] : null;
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("itch.io")) {
      const slug = parsed.pathname.split("/").filter(Boolean)[0];
      if (slug) return `itch:${slug}`;
    }
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

function isItchUrl(url: string): boolean {
  return url.includes("itch.io");
}

function linkLabelFromUrl(url: string, fallback: string): string {
  if (url.includes("itch.io")) return "Download on Itch.io";
  if (url.includes("steamcommunity.com")) return "Tabletop Simulator Workshop";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "Video";
  return fallback;
}

function addLink(links: ExternalLink[], label: string, url: string) {
  const normalized = normalizeUrl(url);
  if (links.some((l) => normalizeUrl(l.url) === normalized)) return;
  links.push({ label, url });
}

function isLinkOnlyBlock(block: NotionBlock): string | null {
  const text = block.text?.trim() ?? "";
  if (!text) return null;
  const url = extractUrl(text);
  if (!url) return null;
  if (text === url || text.startsWith("http")) return url;
  return null;
}

function isLinkPrefixBlock(block: NotionBlock): { label: string; url?: string } | null {
  const text = block.text?.trim() ?? "";
  const prefixMatch = text.match(
    /^(Video Link|Tabletop Link|Download on Itch\.io):\s*(.*)$/i,
  );
  if (!prefixMatch) return null;
  const [, rawLabel, rest] = prefixMatch;
  const url = extractUrl(rest);
  const label =
    rawLabel.toLowerCase() === "tabletop link"
      ? "Tabletop Simulator Workshop"
      : rawLabel.replace(/:\s*$/, "");
  return { label, url: url ?? undefined };
}

function fileLinkLabel(block: NotionBlock): string {
  const name = block.text ?? "File";
  if (name.toLowerCase().endsWith(".xlsx")) return "View Excel Simulation Model";
  if (name.toLowerCase().endsWith(".apk")) return "Download Playable APK";
  return name;
}

function shouldSkipBlock(slug: string, block: NotionBlock): boolean {
  if (
    slug === "miracle-born-dead" &&
    block.type === "image" &&
    block.text?.includes("Miracle Born")
  ) {
    return true;
  }
  return false;
}

function extractTopLevelLinks(
  blocks: NotionBlock[],
  slug: string,
): {
  content: NotionBlock[];
  links: ExternalLink[];
} {
  const links: ExternalLink[] = [];
  const content: NotionBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (shouldSkipBlock(slug, block)) {
      i++;
      continue;
    }

    if (block.type === "divider") {
      const prev = content[content.length - 1];
      const next = blocks[i + 1];
      if (
        content.length === 0 &&
        (next?.type === "file" || next?.type === "divider")
      ) {
        i++;
        continue;
      }
      if (prev?.type === "divider") {
        i++;
        continue;
      }
    }

    const prefix = isLinkPrefixBlock(block);
    if (prefix) {
      if (prefix.url) {
        addLink(links, prefix.label, prefix.url);
      } else {
        const next = blocks[i + 1];
        const nextUrl = next ? isLinkOnlyBlock(next) : null;
        if (nextUrl) {
          addLink(links, prefix.label, nextUrl);
          i += 2;
          continue;
        }
      }
      i++;
      continue;
    }

    const soloUrl = isLinkOnlyBlock(block);
    if (soloUrl) {
      addLink(links, linkLabelFromUrl(soloUrl, "External Link"), soloUrl);
      i++;
      continue;
    }

    if (block.type === "file" || block.type === "link") {
      if (block.url) {
        addLink(links, fileLinkLabel(block), block.url);
      }
      const next = blocks[i + 1];
      if (next?.type === "divider" && content[content.length - 1]?.type === "divider") {
        content.pop();
      }
      i++;
      continue;
    }

    content.push(block);
    i++;
  }

  while (content.length > 0 && content[content.length - 1].type === "divider") {
    content.pop();
  }

  return { content, links };
}

function injectTopLinks(
  content: NotionBlock[],
  slug: string,
  topLinks: ExternalLink[],
): NotionBlock[] {
  if (topLinks.length === 0) return content;

  const inlineBlock: NotionBlock = {
    type: "inline-links",
    inlineLinks: topLinks,
  };

  const result = [...content];
  if (slug === "harvey-park" && result.length > 0) {
    result.splice(1, 0, inlineBlock);
  } else {
    result.unshift(inlineBlock);
  }
  return result;
}

export function processNotionContent(
  blocks: NotionBlock[],
  slug: string,
  portfolioLinks: ExternalLink[] = [],
): { content: NotionBlock[]; externalLinks: ExternalLink[] } {
  const { content, links } = extractTopLevelLinks(blocks, slug);

  const topLinks: ExternalLink[] = [];
  const bottomLinks: ExternalLink[] = [];

  for (const link of [...links, ...portfolioLinks]) {
    if (TOP_LINK_SLUGS.has(slug) && isItchUrl(link.url)) {
      addLink(topLinks, link.label, link.url);
    } else {
      addLink(bottomLinks, link.label, link.url);
    }
  }

  return {
    content: injectTopLinks(content, slug, topLinks),
    externalLinks: bottomLinks,
  };
}
