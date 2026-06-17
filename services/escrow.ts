import { fetchFromApi, type ApiResponse } from "@/lib/api";
import type { DashboardData, EscrowRecord, GrantSummary } from "@/lib/types";

export async function fetchDashboard(): Promise<ApiResponse<DashboardData>> {
  return fetchFromApi<DashboardData>("/api/dashboard");
}

export async function fetchEscrows(): Promise<ApiResponse<EscrowRecord[]>> {
  return fetchFromApi<EscrowRecord[]>("/api/escrows");
}

export async function fetchGrants(): Promise<ApiResponse<GrantSummary[]>> {
  return fetchFromApi<GrantSummary[]>("/api/grants");
}
