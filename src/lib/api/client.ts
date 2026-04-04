import { config } from "@/lib/config";

export class PliqApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "PliqApiError";
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("pliq_token");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${config.apiUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pliq_token");
      window.location.href = "/welcome";
    }
    throw new PliqApiError(401, "UNAUTHORIZED", "Session expired");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new PliqApiError(
      res.status,
      error.code || "UNKNOWN",
      error.message || `Request failed: ${res.status}`,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: (path: string) => request<void>("DELETE", path),
};
