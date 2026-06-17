import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-32 text-center">
      <h1 className="font-[family-name:var(--font-syne)] text-6xl font-bold">404</h1>
      <p className="mt-4 text-[var(--color-muted)]">This project could not be found.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
