"use client";

export const REGISTER_ENDPOINT =
  process.env.NEXT_PUBLIC_REGISTER_ENDPOINT ??
  "http://localhost:5000/api/auth/register";

export const LOGIN_ENDPOINT =
  process.env.NEXT_PUBLIC_LOGIN_ENDPOINT ??
  "http://localhost:5000/api/auth/login";

type ApiRequestOptions = {
  endpoint: string;
  payload: Record<string, unknown>;
};

type ApiSuccess<T = unknown> = {
  ok: true;
  status: number;
  data: T;
};

type ApiFailure = {
  ok: false;
  status: number;
  message: string;
};

export type ApiResult<T = unknown> = ApiSuccess<T> | ApiFailure;

export async function postJson<T = unknown>({
  endpoint,
  payload,
}: ApiRequestOptions): Promise<ApiResult<T>> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    const parsed = rawText ? safelyParseJson(rawText) : null;

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: getApiMessage(parsed) || `Request failed with status ${response.status}`,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: (parsed ?? {}) as T,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message:
        "Could not reach the auth server. Make sure your backend is running on localhost:5000.",
    };
  }
}

export function getApiMessage(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as Record<string, unknown>;
  const directMessage = firstString(record.message, record.error, record.title);
  if (directMessage) return directMessage;

  if (Array.isArray(record.errors)) {
    const joined = record.errors
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const nested = item as Record<string, unknown>;
          return firstString(nested.message, nested.error, nested.msg);
        }
        return "";
      })
      .filter(Boolean)
      .join(", ");

    if (joined) return joined;
  }

  if (record.data && typeof record.data === "object") {
    return getApiMessage(record.data);
  }

  return "";
}

export function getAuthToken(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as Record<string, unknown>;
  const token = firstString(
    record.token,
    record.accessToken,
    record.access_token,
    record.jwt,
  );

  if (token) return token;

  if (record.data && typeof record.data === "object") {
    return getAuthToken(record.data);
  }

  return "";
}

export function getUserPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  return record.user ?? record.data ?? payload;
}

function safelyParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}
