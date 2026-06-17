"use client";

import { useState } from "react";
import Image from "next/image";
import type { NotionBlock } from "@/types/notion";

function resolveAssetUrl(
  url: string | null | undefined,
  slug?: string,
  blockId?: string,
) {
  if (!url) return null;
  if (url.startsWith("/assets/") || url.startsWith("http")) return url;
  if (url.startsWith("attachment:")) {
    const params = new URLSearchParams({ ref: url, slug: slug ?? "" });
    if (blockId) params.set("blockId", blockId);
    return `/api/notion-file?${params.toString()}`;
  }
  return url;
}

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\n+/g, (match) => (match.length >= 2 ? "\n\n" : " "));
}

function isOverviewLabel(label: string): boolean {
  const trimmed = label.trim();
  if (!trimmed || trimmed.length > 45) return false;
  if (/[.]/.test(trimmed)) return false;
  if (/\d$/.test(trimmed)) return false;
  return /^[A-Z]/.test(trimmed);
}

function isHeadingLikeLabel(label: string, nested: boolean): boolean {
  if (!isOverviewLabel(label)) return false;
  if (!nested) return true;
  const trimmed = label.trim();
  if (trimmed.length > 35) return false;
  if (trimmed.split(/\s+/).length > 4) return false;
  return true;
}

type TextMode = "plain" | "overview-labels" | "arrow-steps";

function formatLineWithLabel(line: string, nested = false) {
  const match = line.match(/^([^:\n]+):\s?(.*)$/);
  if (!match) return linkify(line);

  const [, label, rest] = match;
  if (!isHeadingLikeLabel(label, nested)) return linkify(line);
  if (rest && /^\d/.test(rest)) return linkify(line);

  return (
    <>
      <span className="font-bold text-[var(--color-text)]">{label}:</span>
      {rest ? <> {linkify(rest)}</> : null}
    </>
  );
}

function formatLineWithArrow(line: string) {
  const arrowIndex = line.indexOf("→");
  if (arrowIndex <= 0) return linkify(line);

  const label = line.slice(0, arrowIndex).trim();
  const rest = line.slice(arrowIndex + 1);

  return (
    <>
      <span className="font-bold text-[var(--color-text)]">{label}</span>
      <span>
        {" →"}
        {rest ? linkify(rest) : null}
      </span>
    </>
  );
}

function formatLine(line: string, mode: TextMode, nested = false) {
  if (mode === "arrow-steps") return formatLineWithArrow(line);
  if (mode === "overview-labels") return formatLineWithLabel(line, nested);
  return linkify(line);
}

function getTextMode(block: NotionBlock): TextMode {
  if (block.type === "numbered" && block.text?.includes("→")) return "arrow-steps";
  if (block.type === "bullet" || block.type === "paragraph") return "overview-labels";
  return "plain";
}

function BlockText({
  text,
  mode = "plain",
  nested = false,
}: {
  text: string;
  mode?: TextMode;
  nested?: boolean;
}) {
  const normalized = normalizeWhitespace(text);
  return (
    <span className="whitespace-pre-wrap">
      {normalized.split("\n").map((line, i, arr) => (
        <span key={i}>
          {formatLine(line, mode, nested)}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </span>
  );
}

function ToggleBlock({
  block,
  slug,
}: {
  block: NotionBlock;
  slug?: string;
}) {
  const [open, setOpen] = useState(false);
  const level = block.level ?? 1;
  const titleClass =
    level === 1
      ? "font-[family-name:var(--font-syne)] text-xl font-bold md:text-2xl"
      : level === 2
        ? "font-[family-name:var(--font-syne)] text-lg font-semibold"
        : "text-base font-semibold text-[var(--color-warm)]";

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:text-[var(--color-accent)] ${titleClass}`}
      >
        <span
          className={`shrink-0 text-[var(--color-accent)] transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          aria-hidden
        >
          ▶
        </span>
        <span className="flex-1">{block.text}</span>
      </button>
      {open && block.children && block.children.length > 0 && (
        <div className="border-t border-[var(--color-border)] px-5 py-4">
          <NotionContent blocks={block.children} nested slug={slug} />
        </div>
      )}
    </div>
  );
}

function GalleryBlock({
  images,
  slug,
}: {
  images: NonNullable<NotionBlock["images"]>;
  slug?: string;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => {
          const src = resolveAssetUrl(image.url, slug, image.blockId);
          if (!src) return null;
          return (
            <button
              key={image.blockId ?? image.url ?? i}
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
            >
              {src.startsWith("/assets/") ? (
                <Image
                  src={src}
                  alt={image.text ?? "Gallery image"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={image.text ?? "Gallery image"}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </button>
          );
        })}
      </div>
      {lightbox !== null && images[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            Close
          </button>
          {(() => {
            const image = images[lightbox];
            const src = resolveAssetUrl(image.url, slug, image.blockId);
            if (!src) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={image.text ?? "Gallery image"}
                className="max-h-[90vh] max-w-full rounded-lg object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            );
          })()}
        </div>
      )}
    </>
  );
}

function TableBlock({ rows }: { rows: string[][] }) {
  if (rows.length === 0) return null;
  const [header, ...body] = rows;
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-[var(--color-surface-elevated)]">
          <tr>
            {header.map((cell, i) => (
              <th
                key={i}
                className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text)]"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className="border-b border-[var(--color-border)] last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-[var(--color-muted)]">
                  <BlockText text={cell} mode="plain" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PdfEmbed({
  url,
  title,
}: {
  url: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const label = title ?? "PDF Document";

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 px-5 py-4 text-left transition-colors hover:text-[var(--color-accent)]"
        >
          <span
            className={`shrink-0 text-[var(--color-accent)] transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            aria-hidden
          >
            ▶
          </span>
          <span className="truncate font-[family-name:var(--font-syne)] text-base font-semibold md:text-lg">
            {label}
          </span>
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 pr-5 text-xs text-[var(--color-accent)] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Open in new tab ↗
        </a>
      </div>
      {open && (
        <div className="border-t border-[var(--color-border)]">
          <iframe
            src={url}
            title={label}
            className="h-[80vh] w-full bg-white"
          />
        </div>
      )}
    </div>
  );
}

function renderBlock(
  block: NotionBlock,
  index: number,
  slug?: string,
  nested = false,
) {
  const assetUrl = resolveAssetUrl(block.url, slug, block.blockId);
  const textMode = getTextMode(block);

  switch (block.type) {
    case "heading1":
      return (
        <h2
          key={index}
          className="mt-12 font-[family-name:var(--font-syne)] text-3xl font-bold first:mt-0"
        >
          {block.text}
        </h2>
      );
    case "heading2":
      return (
        <h3
          key={index}
          className="mt-8 font-[family-name:var(--font-syne)] text-2xl font-bold"
        >
          {block.text}
        </h3>
      );
    case "heading3":
      return (
        <h4 key={index} className="mt-6 text-lg font-semibold text-[var(--color-warm)]">
          {block.text}
        </h4>
      );
    case "paragraph":
      if (!block.text?.trim()) return null;
      return (
        <p key={index} className="leading-relaxed text-[var(--color-muted)]">
          <BlockText text={block.text} mode={textMode} nested={nested} />
        </p>
      );
    case "bullet":
      return (
        <li key={index} className="ml-5 list-disc leading-relaxed text-[var(--color-muted)]">
          <BlockText text={block.text ?? ""} mode={textMode} nested={nested} />
          {block.children && block.children.length > 0 && (
            <ul className="mt-2 space-y-2">
              {block.children.map((child, ci) => renderBlock(child, ci, slug, nested))}
            </ul>
          )}
        </li>
      );
    case "numbered":
      return (
        <li key={index} className="ml-5 list-decimal leading-relaxed text-[var(--color-muted)]">
          <BlockText text={block.text ?? ""} mode={textMode} nested={nested} />
        </li>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="border-l-2 border-[var(--color-accent)] pl-5 italic text-[var(--color-muted)]"
        >
          <BlockText text={block.text ?? ""} mode="plain" />
        </blockquote>
      );
    case "callout":
      return (
        <div
          key={index}
          className="rounded-xl border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-5 py-4 text-[var(--color-text)]"
        >
          <BlockText text={block.text ?? ""} mode="plain" />
        </div>
      );
    case "code":
    case "equation":
      return (
        <pre
          key={index}
          className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-sm text-[var(--color-text)]"
        >
          <code>{block.text}</code>
        </pre>
      );
    case "divider":
      return <hr key={index} className="border-[var(--color-border)]" />;
    case "toggle":
      return <ToggleBlock key={index} block={block} slug={slug} />;
    case "todo":
      return (
        <label key={index} className="flex items-start gap-3 text-[var(--color-muted)]">
          <input type="checkbox" checked={block.checked} readOnly className="mt-1" />
          <BlockText text={block.text ?? ""} mode="plain" />
        </label>
      );
    case "pdf":
      if (!assetUrl) return null;
      return <PdfEmbed key={index} url={assetUrl} title={block.text} />;
    case "link":
    case "file":
    case "embed":
      return (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-4"
        >
          <span className="text-xl">{block.type === "file" ? "📎" : "🔗"}</span>
          <div>
            <p className="font-medium">{block.text}</p>
            {assetUrl && (
              <a
                href={assetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Open file ↗
              </a>
            )}
          </div>
        </div>
      );
    case "image": {
      if (!assetUrl) return null;
      if (assetUrl.startsWith("/assets/")) {
        return (
          <div key={index} className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
            <Image
              src={assetUrl}
              alt={block.text ?? "Project image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        );
      }
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          src={assetUrl}
          alt={block.text ?? "Project image"}
          className="w-full rounded-xl border border-[var(--color-border)]"
        />
      );
    }
    case "table":
      return block.rows ? <TableBlock key={index} rows={block.rows} /> : null;
    case "gallery":
      return block.images ? (
        <GalleryBlock key={index} images={block.images} slug={slug} />
      ) : null;
    case "inline-links":
      if (!block.inlineLinks?.length) return null;
      return (
        <div key={index} className="flex flex-wrap gap-3">
          {block.inlineLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      );
    default:
      return null;
  }
}

interface NotionContentProps {
  blocks: NotionBlock[];
  nested?: boolean;
  slug?: string;
}

export function NotionContent({ blocks, nested = false, slug }: NotionContentProps) {
  const elements: React.ReactNode[] = [];
  let bulletGroup: NotionBlock[] = [];

  const flushBullets = () => {
    if (bulletGroup.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-2">
          {bulletGroup.map((b, i) => renderBlock(b, i, slug, nested))}
        </ul>,
      );
      bulletGroup = [];
    }
  };

  for (const block of blocks) {
    if (block.type === "bullet") {
      bulletGroup.push(block);
    } else {
      flushBullets();
      const el = renderBlock(block, elements.length, slug, nested);
      if (el) elements.push(el);
    }
  }
  flushBullets();

  return <div className={nested ? "space-y-4" : "space-y-5"}>{elements}</div>;
}
