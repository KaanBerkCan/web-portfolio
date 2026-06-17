import notionData from "@/data/notion-content.json";
import type { NotionContentMap, NotionPageContent } from "@/types/notion";

const content = notionData as NotionContentMap;

export function getNotionContent(slug: string): NotionPageContent | undefined {
  return content[slug];
}
