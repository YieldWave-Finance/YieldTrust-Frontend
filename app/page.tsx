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
      <div className="animate-pulse space-y-4 py-8">
        <div className="h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-96 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-80 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-32 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    );
  } else if (error) {
    dashboardContent = (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button
          onClick={() => setRetryKey((k) => k + 1)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
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
    <div className="p-8 mx-auto max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {/* Active Grants Placeholder Card */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Active Grants</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{data?.grants?.length || 0}</p>
            </div>
            <p className="mt-4 text-sm text-green-600 dark:text-green-400">Stable allocation</p>
          </div>

          {/* Legal Hold Status Placeholder Card */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Legal Hold Status</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">0</p>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Accounts restricted</p>
          </div>

          {/* Treasury Analytics Placeholder Card */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Treasury Balance</h3>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">$1,250,000</p>
            </div>
            <p className="mt-4 text-sm text-green-600 dark:text-green-400">+5.2% from last month</p>
          </div>
        </div>
      </section>

      {dashboardContent}
    </div>
  );
}
