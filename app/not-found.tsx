import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-16">
      <p className="text-sm font-medium uppercase text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
        The page you are looking for may have moved, been removed, or never existed.
        Check the address for typos, then return to the dashboard to continue managing
        escrows and grant programs.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
        >
          Back to dashboard
        </Link>
      </div>
      <section aria-labelledby="not-found-help-heading" className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 id="not-found-help-heading" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Need help finding something?
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Try starting from the dashboard and reviewing the available escrow and grant
          sections from there.
        </p>
      </section>
    </main>
  );
}
