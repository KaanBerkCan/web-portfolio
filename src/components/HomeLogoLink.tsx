"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { markHomeTop, scrollToTop } from "@/lib/home-scroll";

export function HomeLogoLink() {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      scroll={false}
      className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight"
      onClick={() => {
        markHomeTop();

        if (pathname === "/") {
          window.history.replaceState(null, "", "/");
          scrollToTop();
        }
      }}
    >
      KBC<span className="text-[var(--color-accent)]">.</span>
    </Link>
  );
}
