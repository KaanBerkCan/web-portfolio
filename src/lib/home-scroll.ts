export const HOME_SCROLL_KEY = "portfolio-home-scroll";
export const NAV_INTENT_KEY = "portfolio-nav-intent";

export type HomeNavIntent = "top" | "restore";

export function readHomeScroll(): number {
  try {
    const value = sessionStorage.getItem(HOME_SCROLL_KEY);
    return value ? Number(value) : 0;
  } catch {
    return 0;
  }
}

export function writeHomeScroll(y: number) {
  try {
    if (y < 0) return;
    sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(y)));
  } catch {
    // ignore
  }
}

export function setNavIntent(intent: HomeNavIntent) {
  try {
    sessionStorage.setItem(NAV_INTENT_KEY, intent);
  } catch {
    // ignore
  }
}

export function consumeNavIntent(): HomeNavIntent {
  try {
    const value = sessionStorage.getItem(NAV_INTENT_KEY);
    sessionStorage.removeItem(NAV_INTENT_KEY);
    return value === "top" ? "top" : "restore";
  } catch {
    return "restore";
  }
}

export function markHomeTop() {
  setNavIntent("top");
  writeHomeScroll(0);
}

export function markHomeRestore() {
  setNavIntent("restore");
}

export function scrollToY(y: number) {
  window.scrollTo({ top: y, left: 0, behavior: "instant" });
}

export function scrollToTop() {
  scrollToY(0);
}

export function scheduleScrollTo(y: number) {
  scrollToY(y);
  requestAnimationFrame(() => scrollToY(y));

  const delays = [16, 50, 100, 200, 400, 800, 1200];
  const timeouts = delays.map((ms) => window.setTimeout(() => scrollToY(y), ms));

  const onLoad = () => scrollToY(y);
  window.addEventListener("load", onLoad);

  return () => {
    timeouts.forEach(clearTimeout);
    window.removeEventListener("load", onLoad);
  };
}
