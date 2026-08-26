"use client";

export interface Grant {
  id: string;
  name: string;
  totalAllocated: string;
  totalDistributed: string;
  recipientCount: number;
  active: boolean;
}

interface GrantCardProps {
  grant: Grant;
}

export default function GrantCard({ grant }: GrantCardProps) {
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
