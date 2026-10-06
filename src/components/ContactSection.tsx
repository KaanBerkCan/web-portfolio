import { site } from "@/data/portfolio";

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 md:p-16">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--color-accent)] opacity-10 blur-[80px]" />
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Contact
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-syne)] text-4xl font-bold">
            Let&apos;s build something together
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-muted)]">
            Open to remote Game Design, Technical and Systems Design, Software and
            Analytics roles. Reach out for collaborations, playtesting, or portfolio discussions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`mailto:${site.email}`}
              className="glow rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90"
            >
              {site.email}
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)]"
            >
              Connect on LinkedIn
            </a>
            <a
              href={site.itch}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)]"
            >
              Play on itch.io
            </a>
            <a
              href={site.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)]"
            >
              Download CV
            </a>
            {site.phone ? (
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)]"
              >
                {site.phone}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
