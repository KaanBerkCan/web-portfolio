import { site } from "@/data/portfolio";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--color-accent)] opacity-10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-20 md:pb-16 md:pt-28">
        <p className="animate-fade-up mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Game & System Design
        </p>
        <h1 className="animate-fade-up animate-delay-1 font-[family-name:var(--font-syne)] text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
          {site.name}
        </h1>
        <p className="animate-fade-up animate-delay-2 mt-6 max-w-2xl text-xl text-[var(--color-muted)] md:text-2xl">
          {site.tagline}
        </p>

        <div className="animate-fade-up animate-delay-3 mt-10 flex flex-wrap gap-4">
          <a
            href="#works"
            className="glow rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90"
          >
            View Selected Works
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)]"
          >
            LinkedIn
          </a>
          <a
            href={site.itch}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)]"
          >
            itch.io
          </a>
          <a
            href={site.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)]"
          >
            Download CV
          </a>
        </div>

        <div className="animate-fade-up animate-delay-4 mt-12 grid grid-cols-2 justify-items-center gap-6 border-t border-[var(--color-border)] pt-8 md:grid-cols-4">
          {[
            { label: "Digital Games", value: "4" },
            { label: "Tabletop Systems", value: "3" },
            { label: "Game Concepts", value: "3" },
            { label: "Research & Analysis", value: "5" },
          ].map((stat) => (
            <div key={stat.label} className="text-left">
              <p className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--color-accent)]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
