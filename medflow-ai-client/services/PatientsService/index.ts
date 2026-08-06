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

export const getPatients = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/patients`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    const result = (await res.json().catch(() => ({}))) as ApiResponse<unknown>;

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Unable to fetch patients",
        data: [],
      };
    }

    const payload = (result?.data ?? result) as Record<string, unknown> | unknown[] | undefined;
    const patients = Array.isArray(payload)
      ? payload
      : (payload as Record<string, unknown> | undefined)?.patients ?? (payload as Record<string, unknown> | undefined)?.patient ?? [];

    return {
      success: true,
      data: patients,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to fetch patients";
    return {
      success: false,
      message,
      data: [],
    };
  }
};

export const createPatient = async (patientData: Record<string, unknown>) => {
  try {
    const res = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(patientData),
    });

    const result = (await res.json().catch(() => ({}))) as ApiResponse<Record<string, unknown>>;

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Unable to create patient",
        error: result?.error,
      };
    }

    return {
      success: true,
      data: result?.data ?? result,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create patient";
    return {
      success: false,
      message,
    };
  }
};
