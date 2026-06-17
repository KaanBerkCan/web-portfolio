import { education, experience } from "@/data/portfolio";

const experienceItems = experience ?? [];
const educationItems = education ?? [];

export function EducationExperienceSection() {
  return (
    <section
      id="education-experience"
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Background
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-syne)] text-4xl font-bold md:text-5xl">
            Education &amp; Experience
          </h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <h3 className="mb-8 border-l-2 border-[var(--color-subtitle)] pl-5 font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--color-subtitle)]">
              Experience
            </h3>
            <div className="space-y-10">
              {experienceItems.map((entry) => (
                <article
                  key={entry.organization}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6"
                >
                  <div className="mb-5">
                    <h4 className="font-[family-name:var(--font-syne)] text-lg font-bold">
                      {entry.organization}
                    </h4>
                    <p className="mt-1 text-sm text-[var(--color-warm)]">{entry.period}</p>
                  </div>
                  <div className="space-y-5">
                    {entry.roles.map((role) => (
                      <div
                        key={`${entry.organization}-${role.title}-${role.period}`}
                        className="border-t border-[var(--color-border)] pt-5 first:border-t-0 first:pt-0"
                      >
                        <p className="font-medium text-[var(--color-text)]">{role.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                          {role.period}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                          {role.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-8 border-l-2 border-[var(--color-subtitle)] pl-5 font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--color-subtitle)]">
              Education
            </h3>
            <div className="space-y-5">
              {educationItems.map((entry) => (
                <article
                  key={`${entry.institution}-${entry.period}`}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6"
                >
                  <h4 className="font-[family-name:var(--font-syne)] text-lg font-bold">
                    {entry.institution}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">
                    {entry.program}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-warm)]">{entry.period}</p>
                  {entry.detail && (
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{entry.detail}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
