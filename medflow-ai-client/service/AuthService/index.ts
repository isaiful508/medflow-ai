import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "accessToken";

const saveToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
};

const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

type AuthResponse = {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
  };
};

export const registerUser = async (
  userData: Record<string, unknown>,
): Promise<AuthResponse | Error> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result.success && result.data?.accessToken) {
      saveToken(result.data.accessToken);
    }

    return result;
  } catch (error: any) {
    return Error(error?.message || "Unable to register.");
  }
};

export const loginUser = async (
  userData: Record<string, unknown>,
): Promise<AuthResponse | Error> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result.success && result.data?.accessToken) {
      saveToken(result.data.accessToken);
    }

    return result;
  } catch (error: any) {
    return Error(error?.message || "Unable to sign in.");
  }
};

export const getCurrentUser = async () => {
  const accessToken = getToken();
  if (!accessToken) {
    return null;
  }

  const decodedData = jwtDecode<Record<string, unknown>>(accessToken);
  return decodedData;
};

export const logout = async () => {
  saveToken(null);
};
