import type { ExternalLink } from "@/lib/process-notion-content";

interface ExternalLinksSectionProps {
  links: ExternalLink[];
}

export function ExternalLinksSection({ links }: ExternalLinksSectionProps) {
  if (links.length === 0) return null;

  return (
    <section className="mt-12">
      <hr className="border-[var(--color-border)]" />
      <h2 className="mt-8 font-[family-name:var(--font-syne)] text-2xl font-bold">
        External Links
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((link) => (
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
      <hr className="mt-8 border-[var(--color-border)]" />
    </section>
  );
}
