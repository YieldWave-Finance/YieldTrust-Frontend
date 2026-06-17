"use client";

import { useEffect, useState } from "react";
import { fetchDashboard } from "@/services/escrow";
import type { DashboardData, EscrowRecord, GrantSummary } from "@/lib/types";
import type { ReactNode } from "react";

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

function EscrowTable({ escrows }: { escrows: EscrowRecord[] }) {
  if (escrows.length === 0) {
    return <p className="text-zinc-500">No escrow records yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="py-2 pr-4 font-medium">Title</th>
            <th className="py-2 pr-4 font-medium">Amount</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 font-medium">Beneficiary</th>
          </tr>
        </thead>
        <tbody>
          {escrows.map((e) => (
            <tr key={e.id} className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-2 pr-4">{e.title}</td>
              <td className="py-2 pr-4">{e.amount}</td>
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

function GrantCard({ grant }: { grant: GrantSummary }) {
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
        {grant.totalDistributed} / {grant.totalAllocated}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-pulse">
      <div className="mb-8 h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mb-12 h-6 w-72 rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="mb-8 h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded bg-zinc-100 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
        Unable to load dashboard
      </p>
      <p className="mt-2 text-sm text-zinc-500">{message}</p>
      <button
        onClick={onRetry}
        type="button"
        className="mt-6 rounded-full bg-accent px-6 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Retry
      </button>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void fetchDashboard().then((res) => {
      if (cancelled) return;
      if (res.error) {
        setError(res.error);
        setData(null);
      } else {
        setData(res.data);
        setError(null);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  let dashboardContent: ReactNode = null;

  if (loading) {
    dashboardContent = <LoadingSkeleton />;
  } else if (error) {
    dashboardContent = (
      <ErrorState message={error} onRetry={() => setRetryKey((k) => k + 1)} />
    );
  } else if (data) {
    dashboardContent = (
      <>
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
            Active Escrows
          </h2>
          <EscrowTable escrows={data.escrows} />
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="max-w-3xl">
        <p className="text-sm font-medium uppercase text-accent">YieldTrust onboarding</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Escrow and grant oversight for accountable funding
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Protect project funds with milestone-based escrows, enforce legal holds when
          disputes arise, and monitor grant tracking from allocation through distribution.
        </p>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="YieldTrust onboarding">
        {onboardingSteps.map((step) => (
          <article
            key={step.title}
            className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {step.copy}
            </p>
          </article>
        ))}
      </section>

      {dashboardContent}
    </div>
  );
}
