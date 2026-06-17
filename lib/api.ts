export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return "http://localhost:4000";
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function fetchFromApi<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const body = await res.json().catch(() => null);
    return {
      data: res.ok ? (body as T) : null,
      error: res.ok ? null : body?.error ?? `Request failed with status ${res.status}`,
      status: res.status,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Network error",
      status: 0,
    };
  }
}
