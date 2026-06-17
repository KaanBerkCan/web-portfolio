import Link from "next/link";
import { HomeLogoLink } from "./HomeLogoLink";

const nav = [
  { href: "/#about", label: "About" },
  { href: "/#works", label: "Works" },
  { href: "/#education-experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <HomeLogoLink />
        <nav className="hidden items-center gap-8 sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href="mailto:kaanc5528@gmail.com"
          className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}
