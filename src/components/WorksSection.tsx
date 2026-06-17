import { categories, getProjectsByCategory } from "@/data/portfolio";
import { ProjectCard } from "./ProjectCard";

export function WorksSection() {
  return (
    <section id="works" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Portfolio
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-syne)] text-4xl font-bold md:text-5xl">
          Selected Works
        </h2>
      </div>

      <div className="space-y-20">
        {categories.map((category) => {
          const items = getProjectsByCategory(category.id);
          return (
            <div key={category.id}>
              <div className="mb-8 border-l-2 border-[var(--color-subtitle)] pl-5">
                <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--color-subtitle)]">
                  {category.label}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {category.description}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
