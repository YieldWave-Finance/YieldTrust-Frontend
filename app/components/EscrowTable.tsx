"use client";

export interface Escrow {
  id: string;
  title: string;
  amount: string;
  status: string;
  beneficiary: string;
  createdAt: string;
}

interface EscrowTableProps {
  escrows: Escrow[];
}

export default function EscrowTable({ escrows }: EscrowTableProps) {
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
