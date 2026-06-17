"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  consumeNavIntent,
  readHomeScroll,
  scheduleScrollTo,
  scrollToTop,
  writeHomeScroll,
} from "@/lib/home-scroll";

const HOME_PATH = "/";

function isProjectPath(path: string) {
  return path.startsWith("/projects/");
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

    const intent = consumeNavIntent();

    if (window.location.hash) {
      isRestoring.current = true;
      const tryHash = () => scrollToHashTarget();
      tryHash();
      const timeouts = [16, 50, 100, 200, 400].map((ms) =>
        window.setTimeout(tryHash, ms),
      );
      const done = window.setTimeout(() => {
        isRestoring.current = false;
      }, 400);

      return () => {
        timeouts.forEach(clearTimeout);
        clearTimeout(done);
        isRestoring.current = false;
      };
    }

    if (intent === "top") {
      isRestoring.current = true;
      writeHomeScroll(0);
      const cancel = scheduleScrollTo(0);
      const done = window.setTimeout(() => {
        isRestoring.current = false;
      }, 200);

      return () => {
        cancel();
        clearTimeout(done);
        isRestoring.current = false;
      };
    }

    const saved = readHomeScroll();
    if (saved <= 0) {
      return;
    }

    isRestoring.current = true;
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const cancel = scheduleScrollTo(saved);
    const done = window.setTimeout(() => {
      html.style.scrollBehavior = previousBehavior;
      isRestoring.current = false;
    }, 200);

    return () => {
      cancel();
      clearTimeout(done);
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

    const persist = () => {
      if (isRestoring.current) return;
      writeHomeScroll(window.scrollY);
    };

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        persist();
      });
    };

    const onNavigateIntent = (event: Event) => {
      if (isRestoring.current) return;

      if (event.type === "click") {
        const anchor = (event.target as Element).closest("a[href]");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
        if (href.startsWith("http")) return;
      }

      writeHomeScroll(window.scrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onNavigateIntent, true);
    window.addEventListener("pagehide", onNavigateIntent);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onNavigateIntent, true);
      window.removeEventListener("pagehide", onNavigateIntent);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      writeHomeScroll(window.scrollY);
    };
  }, [pathname]);

  return null;
}
