"use client";

import { useState, useEffect } from "react";

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

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-8">
        <div className="h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-96 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-80 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-32 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button
          onClick={() => setRetryKey((k) => k + 1)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

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
              <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{data.grants.length}</p>
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

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Active Grants</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.grants.map((grant) => (
            <div
              key={grant.id}
              className="rounded-lg border p-4 shadow-sm"
            >
              <h3 className="font-medium">{grant.name}</h3>
              <p className="text-sm text-zinc-600">
                Allocated: ${Number(grant.totalAllocated).toLocaleString()}
              </p>
              <p className="text-sm text-zinc-600">
                Distributed: ${Number(grant.totalDistributed).toLocaleString()}
              </p>
              <p className="text-sm text-zinc-600">
                Recipients: {grant.recipientCount}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Escrows</h2>
        <table className="w-full table-auto border-collapse border border-zinc-300">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="border border-zinc-300 px-4 py-2 text-left">Title</th>
              <th className="border border-zinc-300 px-4 py-2 text-left">Amount</th>
              <th className="border border-zinc-300 px-4 py-2 text-left">Status</th>
              <th className="border border-zinc-300 px-4 py-2 text-left">Beneficiary</th>
              <th className="border border-zinc-300 px-4 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.escrows.map((escrow) => (
              <tr key={escrow.id}>
                <td className="border border-zinc-300 px-4 py-2">{escrow.title}</td>
                <td className="border border-zinc-300 px-4 py-2">
                  ${Number(escrow.amount).toLocaleString()}
                </td>
                <td className="border border-zinc-300 px-4 py-2">{escrow.status}</td>
                <td className="border border-zinc-300 px-4 py-2">{escrow.beneficiary}</td>
                <td className="border border-zinc-300 px-4 py-2">{escrow.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
