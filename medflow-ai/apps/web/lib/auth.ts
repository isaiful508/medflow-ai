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

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}
