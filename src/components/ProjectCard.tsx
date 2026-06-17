import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/portfolio";
import { getNotionContent } from "@/lib/notion-content";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const notion = getNotionContent(project.slug);
  const cover = notion?.coverImage;
  const coverPosition = notion?.coverImagePosition;
  const coverStyle = coverPosition ? { objectPosition: coverPosition } : undefined;

  return (
    <Link
      href={`/projects/${project.slug}`}
      scroll={false}
      className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      {cover && (
        <div className="relative h-44 w-full overflow-hidden border-b border-[var(--color-border)]">
          {cover.startsWith("/assets/") ? (
            <Image
              src={cover}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              style={coverStyle}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={coverStyle}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent opacity-60" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-tag-bg)] px-2.5 py-0.5 text-xs text-[var(--color-tag-text)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold transition-colors group-hover:text-[var(--color-accent)]">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-warm)]">{project.genre}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)] line-clamp-3">
          {project.summary}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <span className="text-xs text-[var(--color-muted)]">{project.status}</span>
          <span className="text-sm text-[var(--color-accent)] transition-transform group-hover:translate-x-1">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
}
