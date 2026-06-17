import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProjectBySlug } from "@/data/portfolio";
import { getNotionContent } from "@/lib/notion-content";
import { processNotionContent } from "@/lib/process-notion-content";
import { NotionContent } from "@/components/NotionContent";
import { ExternalLinksSection } from "@/components/ExternalLinksSection";
import { ProjectPageShell } from "@/components/ProjectPageShell";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Kaan Berk Can`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const notionContent = getNotionContent(slug);
  const processed = notionContent
    ? processNotionContent(notionContent.content, slug, project.links ?? [])
    : null;

  return (
    <ProjectPageShell
      backHref="/"
      backLabel="Back to works"
      coverImage={notionContent?.coverImage}
      coverImagePosition={notionContent?.coverImagePosition}
      title={project.title}
      tags={project.tags}
      genre={project.genre}
      role={project.role}
      status={project.status}
      category={project.category}
    >
      {processed && processed.content.length > 0 ? (
        <>
          <NotionContent blocks={processed.content} slug={slug} />
          <ExternalLinksSection links={processed.externalLinks} />
        </>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold">Overview</h2>
            <p className="mt-4 leading-relaxed text-[var(--color-muted)]">{project.summary}</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold">
              Design Highlights
            </h2>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex gap-3 leading-relaxed text-[var(--color-muted)]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </ProjectPageShell>
  );
}
