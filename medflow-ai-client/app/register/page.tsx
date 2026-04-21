"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Phone,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  role: string;
  terms: boolean;
};

function PasswordStrength({ password }: { password: string }) {
  const getStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  if (!password) return null;

  const score = getStrength(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#EF4444", "#F59E0B", "#10B981", "#10B981"];
  const segColors = [
    "bg-white/10",
    "bg-red-500",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-emerald-400",
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
              i < score ? segColors[score] : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] mt-1" style={{ color: colors[score] }}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: { role: "patient" },
  });

  const password = watch("password");
  const termsAccepted = watch("terms");

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);
    console.log("Register Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setGoogleLoading(false);
  };

  const roles = [
    { value: "patient", label: "Patient", icon: "👤" },
    { value: "doctor", label: "Doctor", icon: "🩺" },
    { value: "admin", label: "Admin", icon: "🛡️" },
  ];

  const selectedRole = watch("role");

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-8">
      
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

      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-25 blur-[60px] animate-[float1_8s_ease-in-out_infinite]"
        style={{ background: "#2563EB" }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full opacity-25 blur-[60px] animate-[float2_10s_ease-in-out_infinite]"
        style={{ background: "#10B981" }}
      />
      <div
        className="absolute top-1/2 left-2/3 w-48 h-48 rounded-full opacity-20 blur-[60px] animate-[float3_12s_ease-in-out_infinite]"
        style={{ background: "#8B5CF6" }}
      />

      {/* ── Floating badges ── */}
      <div
        className="absolute top-[14%] left-6 hidden lg:flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs backdrop-blur-md border border-white/10 z-10"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-white font-medium text-[12px]">Free to join</p>
          <p className="text-white/45 text-[11px]">No credit card required</p>
        </div>
      </div>
      <div
        className="absolute bottom-[14%] right-6 hidden lg:flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs backdrop-blur-md border border-white/10 z-10"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
        <div>
          <p className="text-white font-medium text-[12px]">HIPAA Compliant</p>
          <p className="text-white/45 text-[11px]">End-to-end encrypted</p>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-md px-4">

        {/* Brand mark */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] border border-white/12 backdrop-blur-md mb-2"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
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
          className="rounded-[8px] border border-white/12 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <CardHeader className="pb-0 pt-7 px-7">
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-xl font-semibold text-white">Create your account</h1>
            </div>
          </CardHeader>

          <CardContent className="px-7 pt-5 pb-7">

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-[10px] rounded-[8px] border border-white/12 text-white/75 text-[13px] font-medium transition-all hover:bg-white/10 hover:text-white active:scale-[0.98] disabled:opacity-60 mb-5"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? "Connecting..." : "Sign up with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-[11.5px]">or register with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Full name + Email row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                    Full name
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Saiful Islam"
                      className="pr-9 rounded-[8px] border-white/12 text-white placeholder:text-white/25 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 h-10 text-[13px]"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                      {...register("fullName", { required: "Required" })}
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] text-red-400 mt-0.5">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                    Mobile
                  </label>
                  <div className="relative">
                    <Input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className="pr-9 rounded-[8px] border-white/12 text-white placeholder:text-white/25 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 h-10 text-[13px]"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                      {...register("mobile", {
                        minLength: { value: 10, message: "Invalid number" },
                      })}
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                  </div>
                  {errors.mobile && (
                    <p className="text-[11px] text-red-400 mt-0.5">{errors.mobile.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                  Email address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pr-9 rounded-[8px] border-white/12 text-white placeholder:text-white/25 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 h-10 text-[13px]"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                    })}
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 mt-0.5">{errors.email.message}</p>
                )}
              </div>

              {/* Password + Confirm row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-9 rounded-[8px] border-white/12 text-white placeholder:text-white/25 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 h-10 text-[13px]"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                      {...register("password", {
                        required: "Required",
                        minLength: { value: 6, message: "Min 6 characters" },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-400 mt-0.5">{errors.password.message}</p>
                  )}
                  <PasswordStrength password={password} />
                </div>

                <div>
                  <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-9 rounded-[8px] border-white/12 text-white placeholder:text-white/25 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 h-10 text-[13px]"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                      {...register("confirmPassword", {
                        required: "Required",
                        validate: (v) => v === password || "Passwords don't match",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-red-400 mt-0.5">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Role selector — styled cards */}
              <div>
                <label className="block mb-2 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                  I am a
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <label
                      key={r.value}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-[8px] border cursor-pointer transition-all text-center ${
                        selectedRole === r.value
                          ? "border-blue-500/70 bg-blue-500/15 text-white"
                          : "border-white/10 bg-white/5 text-white/45 hover:border-white/20 hover:text-white/70"
                      }`}
                    >
                      <input
                        type="radio"
                        value={r.value}
                        className="sr-only"
                        {...register("role", { required: true })}
                      />
                      <span className="text-lg leading-none">{r.icon}</span>
                      <span className="text-[12px] font-medium">{r.label}</span>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-[11px] text-red-400 mt-1">Role is required</p>
                )}
              </div>

              {/* Terms */}
              <div
                className="flex items-start gap-2.5 p-3 rounded-[8px] border border-white/8"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 accent-blue-500 cursor-pointer flex-shrink-0"
                  {...register("terms", { required: "You must accept terms" })}
                />
                <label className="text-[12px] text-white/50 leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline">
                    Privacy Policy
                  </Link>
                  . I consent to processing of my health data.
                </label>
              </div>
              {errors.terms && (
                <p className="text-[11px] text-red-400 -mt-2">{errors.terms.message}</p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading || !termsAccepted}
                className="w-full h-11 rounded-[8px] font-semibold text-[14px] tracking-wide bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border-none shadow-[0_4px_15px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-center mt-5 text-[12.5px] text-white/40">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}