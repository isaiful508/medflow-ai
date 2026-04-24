import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import API from "@/lib/api";
import {
  getApiMessage,
  getAuthToken,
  getUserPayload,
} from "@/lib/auth";

type LoginPayload = {
  email: string;
  password: string;
  remember: boolean;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  role: "patient" | "doctor" | "admin";
};

type RequestState = {
  isLoading: boolean;
  error: string;
  success: string;
};

type AuthState = {
  token: string;
  user: unknown | null;
  login: RequestState;
  register: RequestState;
};

const createRequestState = (): RequestState => ({
  isLoading: false,
  error: "",
  success: "",
});

const initialState: AuthState = {
  token: "",
  user: null,
  login: createRequestState(),
  register: createRequestState(),
};

export const loginUser = createAsyncThunk<
  { message: string; token: string; user: unknown; payload: unknown },
  LoginPayload,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
    const data = response.data;
    const token = getAuthToken(data);
    const user = getUserPayload(data);
    const message = getApiMessage(data) || "Login successful.";

    persistLogin({
      remember: credentials.remember,
      token,
      user,
      payload: data,
    });

    return {
      message,
      token,
      user,
      payload: data,
    };
  } catch (error) {
    return rejectWithValue(getRequestErrorMessage(error));
  }
});

export const registerUser = createAsyncThunk<
  { message: string; payload: unknown },
  RegisterPayload,
  { rejectValue: string }
>("auth/registerUser", async (formData, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/register", {
      fullName: formData.fullName,
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobile,
      phone: formData.mobile,
      role: formData.role,
    });
    const data = response.data;

    return {
      message:
        getApiMessage(data) || "Registration successful. You can sign in now.",
      payload: data,
    };
  } catch (error) {
    return rejectWithValue(getRequestErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearLoginState(state) {
      state.login = createRequestState();
    },
    clearRegisterState(state) {
      state.register = createRequestState();
    },
    logout(state) {
      state.token = "";
      state.user = null;
      clearPersistedLogin();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.login.isLoading = true;
        state.login.error = "";
        state.login.success = "";
      })
      .addCase(
        loginUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            message: string;
            token: string;
            user: unknown;
          }>,
        ) => {
          state.login.isLoading = false;
          state.login.success = action.payload.message;
          state.login.error = "";
          state.token = action.payload.token;
          state.user = action.payload.user;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.login.isLoading = false;
        state.login.success = "";
        state.login.error = action.payload ?? "Unable to sign in.";
      })
      .addCase(registerUser.pending, (state) => {
        state.register.isLoading = true;
        state.register.error = "";
        state.register.success = "";
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.register.isLoading = false;
          state.register.success = action.payload.message;
          state.register.error = "";
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.register.isLoading = false;
        state.register.success = "";
        state.register.error = action.payload ?? "Unable to create account.";
      });
  },
});

export const { clearLoginState, clearRegisterState, logout } = authSlice.actions;
export default authSlice.reducer;

function persistLogin({
  remember,
  token,
  user,
  payload,
}: {
  remember: boolean;
  token: string;
  user: unknown;
  payload: unknown;
}) {
  if (typeof window === "undefined") {
    return;
  }

  const targetStorage = remember ? window.localStorage : window.sessionStorage;
  const otherStorage = remember ? window.sessionStorage : window.localStorage;

  otherStorage.removeItem("medflow_auth_response");
  otherStorage.removeItem("medflow_auth_user");
  otherStorage.removeItem("medflow_auth_token");

  targetStorage.setItem("medflow_auth_response", JSON.stringify(payload));
  targetStorage.setItem("medflow_auth_user", JSON.stringify(user));

  if (token) {
    targetStorage.setItem("medflow_auth_token", token);
  } else {
    targetStorage.removeItem("medflow_auth_token");
  }
}

function clearPersistedLogin() {
  if (typeof window === "undefined") {
    return;
  }

  for (const storage of [window.localStorage, window.sessionStorage]) {
    storage.removeItem("medflow_auth_response");
    storage.removeItem("medflow_auth_user");
    storage.removeItem("medflow_auth_token");
  }
}

function getRequestErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      getApiMessage(error.response?.data) ||
      error.message ||
      "Could not reach the auth server. Make sure your backend is running on localhost:5000."
    );
  }

  return "Something went wrong while contacting the auth server.";
}
