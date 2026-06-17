import { site } from "@/data/portfolio";

export function AboutSection() {
  return (
    <section id="about" className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-stretch md:gap-16">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
                About
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-syne)] text-4xl font-bold">
                Engineering meets game design
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                "System Design",
                "Technical Design",
                "Game Analytics",
                "Python",
                "Unity",
                "Mathematical Modeling",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-1.5 text-sm text-[var(--color-text)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="text-[var(--color-muted)] leading-relaxed md:flex md:items-center">
            <p>{site.bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
