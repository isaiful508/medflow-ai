"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Stethoscope } from "lucide-react";
import {
  getApiMessage,
  getAuthToken,
  getUserPayload,
  LOGIN_ENDPOINT,
  postJson,
} from "@/lib/auth";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setSubmitError("");
    setSuccessMessage("");
    setIsLoading(true);

    const result = await postJson({
      endpoint: LOGIN_ENDPOINT,
      payload: {
        email: data.email,
        password: data.password,
      },
    });

    if (!result.ok) {
      setSubmitError(result.message);
      setIsLoading(false);
      return;
    }

    const token = getAuthToken(result.data);
    const message = getApiMessage(result.data) || "Login successful.";
    const storage = data.remember ? window.localStorage : window.sessionStorage;

    storage.setItem("medflow_auth_response", JSON.stringify(result.data));
    storage.setItem("medflow_auth_user", JSON.stringify(getUserPayload(result.data)));

    if (token) {
      storage.setItem("medflow_auth_token", token);
    }

    setSuccessMessage(message);
    setIsLoading(false);
    router.push("/");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitError("Google sign-in is not connected yet.");
    setGoogleLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[#060d1f]" />
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(37,99,235,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(16,185,129,0.4) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 60% 10%, rgba(139,92,246,0.35) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 20% 85%, rgba(6,182,212,0.3) 0%, transparent 50%)
          `,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-25 blur-[60px] bg-blue-600" />
      <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full opacity-25 blur-[60px] bg-emerald-500 animate-[float2_10s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 left-2/3 w-48 h-48 rounded-full opacity-20 blur-[60px] bg-violet-500 animate-[float3_12s_ease-in-out_infinite]" />

      <div className="absolute top-[14%] left-6 hidden lg:flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs backdrop-blur-md border border-white/10 bg-white/[0.07] z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-white font-medium text-[12px]">1,284 Patients</p>
          <p className="text-white/45 text-[11px]">Active this month</p>
        </div>
      </div>
      <div className="absolute bottom-[18%] right-6 hidden lg:flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs backdrop-blur-md border border-white/10 bg-white/[0.07] z-10">
        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
        <div>
          <p className="text-white font-medium text-[12px]">HIPAA Compliant</p>
          <p className="text-white/45 text-[11px]">End-to-end encrypted</p>
        </div>
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-md px-4">

        {/* Brand mark above card */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-[8px] border border-white/[0.12] backdrop-blur-md bg-white/[0.07] mb-2">
            <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight">
              <span className="text-blue-400">Medflow</span>AI
            </span>
          </div>
          <p className="text-white/40 text-[12px]">Your trusted telemedicine platform</p>
        </div>

        <Card
          className="rounded-[8px] border border-white/[0.12] shadow-2xl bg-white/[0.06] backdrop-blur-xl"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <CardHeader className="pb-0 pt-7 px-7">
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-xl font-semibold text-white">Welcome back</h1>
              <p className="text-sm text-white/45">Sign in to your MediConnect account</p>
            </div>
          </CardHeader>

          <CardContent className="px-7 pt-6 pb-7">

            {/* ── Google button ── */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-[10px] rounded-[8px] border border-white/[0.12] text-white/75 text-[13px] font-medium transition-all hover:bg-white/10 hover:text-white active:scale-[0.98] disabled:opacity-60 mb-5 bg-white/[0.06]"
            >
              {/* Google SVG icon */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-[11.5px]">or sign in with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {submitError ? (
                <div className="rounded-[8px] border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {submitError}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-[8px] border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {successMessage}
                </div>
              ) : null}

              <div>
                <label className="block mb-1.5 text-[11.5px] font-medium text-white/60 tracking-wide uppercase">
                  Email address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pr-10 rounded-[8px] border-white/[0.12] bg-white/[0.07] text-white placeholder:text-white/25 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 h-11"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                    })}
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1.5 text-[11.5px] font-medium text-white/60 tracking-wide uppercase">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10 rounded-[8px] border-white/[0.12] bg-white/[0.07] text-white placeholder:text-white/25 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 h-11"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-[12.5px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue-500 cursor-pointer"
                    {...register("remember")}
                  />
                  <span className="text-white/50">Keep me signed in</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-[8px] font-semibold text-[14px] tracking-wide bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border-none shadow-[0_4px_15px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)] transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="text-center mt-5 text-[12.5px] text-white/40">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                Create one free
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
