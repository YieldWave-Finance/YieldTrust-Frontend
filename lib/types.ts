export interface EscrowRecord {
  id: string;
  title: string;
  amount: string;
  status: "pending" | "funded" | "released" | "disputed";
  beneficiary: string;
  createdAt: string;
  releasedAt?: string;
}

export interface GrantSummary {
  id: string;
  name: string;
  totalAllocated: string;
  totalDistributed: string;
  recipientCount: number;
  active: boolean;
}

export interface DashboardData {
  escrows: EscrowRecord[];
  grants: GrantSummary[];
}
