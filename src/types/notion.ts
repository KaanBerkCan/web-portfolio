export type NotionBlockType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "bullet"
  | "numbered"
  | "quote"
  | "callout"
  | "code"
  | "divider"
  | "toggle"
  | "todo"
  | "link"
  | "pdf"
  | "file"
  | "embed"
  | "image"
  | "table"
  | "inline-links"
  | "equation"
  | "gallery";

export interface GalleryImage {
  url: string;
  text?: string;
  blockId?: string;
}

export interface NotionBlock {
  type: NotionBlockType;
  text?: string;
  url?: string | null;
  blockId?: string;
  level?: 1 | 2 | 3;
  checked?: boolean;
  rows?: string[][];
  children?: NotionBlock[];
  inlineLinks?: { label: string; url: string }[];
  images?: GalleryImage[];
}

export interface NotionPageContent {
  title: string;
  coverImage?: string;
  coverImagePosition?: string;
  content: NotionBlock[];
}

export type NotionContentMap = Record<string, NotionPageContent>;
