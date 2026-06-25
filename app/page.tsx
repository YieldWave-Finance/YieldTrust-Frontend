"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import nextLogo from "@/public/next.svg";
import vercelLogo from "@/public/vercel.svg";

interface Escrow {
  id: string;
  title: string;
  amount: string;
  status: string;
  beneficiary: string;
  createdAt: string;
}

interface Grant {
  id: string;
  name: string;
  totalAllocated: string;
  totalDistributed: string;
  recipientCount: number;
  active: boolean;
}

interface ApiData {
  escrows: Escrow[];
  grants: Grant[];
}

const onboardingSteps = [
  {
    title: "How it works",
    copy: "Fund milestones into protected escrows, release payments only when obligations are met, and keep every grant movement visible from one dashboard.",
  },
  {
    title: "Get started",
    copy: "Create an escrow for a vendor, grantee, or beneficiary, define release conditions, and track funded, disputed, or released balances as work progresses.",
  },
  {
    title: "Build on Stellar",
    copy: "Use Stellar-ready settlement flows to support transparent grant distribution, fast payouts, and auditable records for field teams and fund managers.",
  },
];

function EscrowTable({ escrows }: { escrows: Escrow[] }) {
  if (escrows.length === 0) {
    return <p className="text-zinc-500">No escrow records yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <caption className="sr-only">
          Active escrow records with title, amount, status, and beneficiary.
        </caption>
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th scope="col" className="py-2 pr-4 font-medium">Title</th>
            <th scope="col" className="py-2 pr-4 font-medium">Amount</th>
            <th scope="col" className="py-2 pr-4 font-medium">Status</th>
            <th scope="col" className="py-2 font-medium">Beneficiary</th>
          </tr>
        </thead>
        <tbody>
          {escrows.map((e) => (
            <tr key={e.id} className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4">{e.title}</td>
              <td className="py-2 pr-4">
                ${Number(e.amount).toLocaleString()}
              </td>
              <td className="py-2 pr-4">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    e.status === "released"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : e.status === "disputed"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  }`}
                >
                  {e.status}
                </span>
              </td>
              <td className="py-2 font-mono text-xs">{e.beneficiary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GrantCard({ grant }: { grant: Grant }) {
  const pct =
    grant.active
      ? ((Number(grant.totalDistributed) / Number(grant.totalAllocated)) * 100).toFixed(1)
      : "100.0";

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{grant.name}</h3>
      <p className="mt-1 text-xs text-zinc-500">
        {grant.recipientCount} recipient{grant.recipientCount !== 1 ? "s" : ""}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-2 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-2 rounded-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{pct}%</span>
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        ${Number(grant.totalDistributed).toLocaleString()} / ${Number(grant.totalAllocated).toLocaleString()}
      </p>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<ApiData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/data")
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `HTTP ${res.status}`);
        }
        return res.json() as Promise<ApiData>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  let dashboardContent: ReactNode = null;

  if (loading) {
    dashboardContent = (
      <section
        aria-label="Dashboard loading"
        aria-live="polite"
        className="animate-pulse space-y-4 py-8"
        role="status"
      >
        <span className="sr-only">Loading dashboard data.</span>
        <div className="h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-96 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-80 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-32 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
      </section>
    );
  } else if (error) {
    dashboardContent = (
      <section
        aria-labelledby="dashboard-error-heading"
        className="flex flex-col items-center justify-center gap-4 py-8"
        role="alert"
      >
        <h2 id="dashboard-error-heading" className="text-lg text-red-600">
          Error: {error}
        </h2>
        <button
          onClick={() => setRetryKey((k) => k + 1)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </section>
    );
  } else if (data) {
    dashboardContent = (
      <>
        <section aria-labelledby="active-escrows-heading" className="mt-12">
          <h2
            id="active-escrows-heading"
            className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Active Escrows
          </h2>
          <EscrowTable escrows={data.escrows} />
        </section>

        <section aria-labelledby="grant-programs-heading" className="mt-12">
          <h2
            id="grant-programs-heading"
            className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Grant Programs
          </h2>
          {data.grants.length === 0 ? (
            <p className="text-zinc-500">No grant programs yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.grants.map((g) => (
                <GrantCard key={g.id} grant={g} />
              ))}
            </div>
          )}
        </section>
      </>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={vercelLogo}
              alt=""
              aria-hidden="true"
              width={1155}
              height={1000}
              className="h-6 w-6 dark:invert"
              unoptimized
            />
            <span className="text-sm font-medium uppercase text-accent">YieldTrust onboarding</span>
          </div>
          <Image
            src={nextLogo}
            alt=""
            aria-hidden="true"
            width={394}
            height={80}
            className="h-4 dark:invert"
            priority
            unoptimized
          />
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Escrow and grant oversight for accountable funding
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Protect project funds with milestone-based escrows, enforce legal holds when
          disputes arise, and monitor grant tracking from allocation through distribution.
        </p>
      </header>

      <section className="mt-10" aria-labelledby="onboarding-heading">
        <h2 id="onboarding-heading" className="sr-only">
          YieldTrust onboarding
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {onboardingSteps.map((step) => (
            <article
              key={step.title}
              className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {step.copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      {dashboardContent}

      <footer className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>YieldTrust escrow and grant oversight dashboard.</p>
      </footer>
    </main>
  );
}
