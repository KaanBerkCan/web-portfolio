"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const HOME_SCROLL_KEY = "portfolio-home-scroll";
const HOME_PATH = "/";

function readHomeScroll(): number {
  try {
    const value = sessionStorage.getItem(HOME_SCROLL_KEY);
    return value ? Number(value) : 0;
  } catch {
    return 0;
  }
}

function writeHomeScroll(y: number) {
  if (y < 0) return;
  sessionStorage.setItem(HOME_SCROLL_KEY, String(y));
}

function isProjectPath(path: string) {
  return path.startsWith("/projects/");
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

function scrollToHashTarget(): boolean {
  const hash = window.location.hash;
  if (!hash) return false;
  const target = document.getElementById(hash.slice(1));
  if (!target) return false;
  target.scrollIntoView({ behavior: "instant", block: "start" });
  return true;
}

export function ScrollRestoration() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const lastHomeScrollY = useRef(0);
  const isRestoring = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    const previousPath = pathnameRef.current;
    if (previousPath !== pathname) {
      if (previousPath === HOME_PATH) {
        writeHomeScroll(lastHomeScrollY.current);
      }
      pathnameRef.current = pathname;
    }

    if (isProjectPath(pathname)) {
      isRestoring.current = true;
      scrollToTop();
      requestAnimationFrame(() => {
        scrollToTop();
        isRestoring.current = false;
      });
      return;
    }

    if (pathname !== HOME_PATH) {
      return;
    }

    if (window.location.hash) {
      isRestoring.current = true;
      const timeouts = [0, 16, 50, 100, 200].map((ms) =>
        window.setTimeout(() => {
          if (scrollToHashTarget()) {
            lastHomeScrollY.current = window.scrollY;
          }
          if (ms === 200) {
            isRestoring.current = false;
          }
        }, ms),
      );

      return () => {
        timeouts.forEach(clearTimeout);
        isRestoring.current = false;
      };
    }

    const saved = readHomeScroll();
    if (saved <= 0) {
      lastHomeScrollY.current = window.scrollY;
      return;
    }

    isRestoring.current = true;
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const restore = () => window.scrollTo({ top: saved, left: 0, behavior: "instant" });

    restore();
    requestAnimationFrame(restore);

    const timeouts = [0, 16, 50, 100, 200].map((ms) =>
      window.setTimeout(() => {
        restore();
        if (ms === 200) {
          html.style.scrollBehavior = previousBehavior;
          isRestoring.current = false;
          lastHomeScrollY.current = saved;
        }
      }, ms),
    );

    return () => {
      timeouts.forEach(clearTimeout);
      html.style.scrollBehavior = previousBehavior;
      isRestoring.current = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== HOME_PATH) return;

    const scrollToHash = () => {
      if (!window.location.hash) return;
      requestAnimationFrame(() => {
        scrollToHashTarget();
      });
    };

    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== HOME_PATH) return;

    lastHomeScrollY.current = window.scrollY;

    const persist = () => {
      if (isRestoring.current) return;
      lastHomeScrollY.current = window.scrollY;
      writeHomeScroll(lastHomeScrollY.current);
    };

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        persist();
      });
    };

    const onNavigateIntent = (event: Event) => {
      if (event.type === "click") {
        const anchor = (event.target as Element).closest("a[href]");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("mailto:") || href.startsWith("http")) return;
      }
      persist();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onNavigateIntent, true);
    window.addEventListener("pagehide", onNavigateIntent);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onNavigateIntent, true);
      window.removeEventListener("pagehide", onNavigateIntent);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      writeHomeScroll(lastHomeScrollY.current);
    };
  }, [pathname]);

  return null;
}
