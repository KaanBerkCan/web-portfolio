"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { markHomeRestore } from "@/lib/home-scroll";

interface ProjectPageShellProps {
  backHref?: string;
  backLabel?: string;
  coverImage?: string | null;
  coverImagePosition?: string;
  title: string;
  tags: string[];
  genre: string;
  role: string;
  status: string;
  category: string;
  children: React.ReactNode;
}

export function ProjectPageShell({
  backHref = "/",
  backLabel = "Back to works",
  coverImage,
  coverImagePosition,
  title,
  tags,
  genre,
  role,
  status,
  category,
  children,
}: ProjectPageShellProps) {
  const [stickyVisible, setStickyVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      const siteHeader = document.querySelector<HTMLElement>("body > header");
      if (siteHeader) setHeaderHeight(siteHeader.offsetHeight);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: `-${headerHeight}px 0px 0px 0px` },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [headerHeight]);

  const coverStyle = coverImagePosition ? { objectPosition: coverImagePosition } : undefined;

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 right-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl transition-transform duration-300 ease-out"
        style={{
          top: headerHeight,
          transform: stickyVisible ? "translateY(0)" : "translateY(-100%)",
        }}
        aria-hidden={!stickyVisible}
      >
        <div className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 px-6 py-2.5">
          <Link
            href={backHref}
            scroll={false}
            onClick={() => markHomeRestore()}
            className="shrink-0 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            ← {backLabel}
          </Link>
          {coverImage && (
            <div className="relative h-9 w-14 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)]">
              {coverImage.startsWith("/assets/") ? (
                <Image
                  src={coverImage}
                  alt=""
                  fill
                  className="object-cover"
                  style={coverStyle}
                  sizes="56px"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt=""
                  className="h-full w-full object-cover"
                  style={coverStyle}
                />
              )}
            </div>
          )}
          <span className="min-w-0 truncate font-[family-name:var(--font-syne)] text-sm font-semibold">
            {title}
          </span>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href={backHref}
          scroll={false}
          onClick={() => markHomeRestore()}
          className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          ← {backLabel}
        </Link>

        {coverImage && (
          <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-2xl border border-[var(--color-border)]">
            {coverImage.startsWith("/assets/") ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover"
                style={coverStyle}
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt={title}
                className="h-full w-full object-cover"
                style={coverStyle}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />
          </div>
        )}

        <header
          className={`border-b border-[var(--color-border)] pb-10 ${coverImage ? "mt-8" : "mt-8"}`}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--color-tag-bg)] px-2.5 py-0.5 text-xs text-[var(--color-tag-text)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-lg text-[var(--color-warm)]">{genre}</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--color-muted)]">Role</dt>
              <dd className="mt-1 text-sm">{role}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--color-muted)]">Status</dt>
              <dd className="mt-1 text-sm">{status}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Category
              </dt>
              <dd className="mt-1 text-sm capitalize">{category.replace("-", " ")}</dd>
            </div>
          </dl>
        </header>

        <div ref={sentinelRef} className="h-px" aria-hidden />

        <div className="mt-10">{children}</div>
      </article>
    </>
  );
}
