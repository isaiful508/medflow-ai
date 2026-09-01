"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:5000/api";

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
};

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  return {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

export const getDoctors = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/doctors`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    const result = (await res.json().catch(() => ({}))) as ApiResponse<unknown>;

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Unable to fetch doctors",
        data: [],
      };
    }

    const payload = (result?.data ?? result) as Record<string, unknown> | unknown[] | undefined;
    const doctors = Array.isArray(payload)
      ? payload
      : (payload as Record<string, unknown> | undefined)?.doctors ?? (payload as Record<string, unknown> | undefined)?.doctor ?? [];

    return {
      success: true,
      data: doctors,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to fetch doctors";
    return {
      success: false,
      message,
      data: [],
    };
  }
};

export const createDoctor = async (doctorData: Record<string, unknown>) => {
  try {
    const res = await fetch(`${API_BASE_URL}/doctors`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(doctorData),
    });

    const result = (await res.json().catch(() => ({}))) as ApiResponse<Record<string, unknown>>;

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Unable to create doctor",
        error: result?.error,
      };
    }

    return {
      success: true,
      data: result?.data ?? result,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create doctor";
    return {
      success: false,
      message,
    };
  }
};
