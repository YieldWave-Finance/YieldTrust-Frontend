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

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/data");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json: ApiData = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

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
          onClick={fetchData}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">YieldTrust Dashboard</h1>

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
