"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/AuthService";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/hooks/useTheme";
import Illustration from "../Illustration";
import SocialLogin from "../socialLogin";

type UserRole = "admin" | "doctor" | "patient";

export default function LoginForm() {
  const router = useRouter();
  const { handleUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const ROLE_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
    admin: { email: "saiful@email.com", password: "PYXS9R508sa" },
    doctor: { email: "doctor@email.com", password: "PYXS9R508sa" },
    patient: { email: "patient@email.com", password: "PYXS9R508sa" },
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const creds = ROLE_CREDENTIALS[role];
    setValue("email", creds.email, { shouldValidate: true });
    setValue("password", creds.password, { shouldValidate: true });
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setSubmitError("");
    setSuccessMessage("");

    const loginData = {
      ...data,
      role: selectedRole,
    } as any;

    const result = await loginUser(loginData);
    setIsLoading(false);

    if (result instanceof Error) {
      setSubmitError(result.message || "Unable to sign in.");
      return;
    }

    if (!result.success) {
      setSubmitError(result.message || "Unable to sign in.");
      return;
    }

    setSuccessMessage(result.message || "Login successful.");
    handleUser();
    router.replace("/dashboard");
  };

  const getRoleStyles = (role: UserRole) => {
    const baseClass = "px-5 py-1.5 rounded-full font-semibold text-sm transition-all duration-200";
    if (selectedRole === role) {
      if (role === "admin") return `${baseClass} bg-emerald-500 text-white shadow-lg shadow-emerald-500/40`;
      if (role === "doctor") return `${baseClass} bg-orange-500 text-white shadow-lg shadow-orange-500/40`;
      if (role === "patient") return `${baseClass} bg-blue-600 text-white shadow-lg shadow-blue-600/40`;
    }
    return `${baseClass} medflow-auth-inactive hover:opacity-80`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-300 medflow-auth-shell medflow-ai-grid relative overflow-hidden"
      style={{ backgroundSize: "60px 60px" }}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-20 p-2 rounded-lg transition-colors duration-200 medflow-auth-toggle"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Main Card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl flex transition-all duration-300 medflow-auth-card">
          {/* Left Side - Form */}
          <div className="flex-1 p-10 lg:p-12 medflow-auth-card">
            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight medflow-auth-shell">
                  <span className="medflow-auth-accent">Medflow</span>AI
                </span>
              </div>
              <p className="text-xs tracking-wide medflow-auth-muted">
                Your trusted telemedicine platform
              </p>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold mb-2 medflow-auth-shell">Sign in</h1>
              <p className="text-sm medflow-auth-muted">Enter your credentials to log in</p>
            </div>

            {/* Role Selection */}
            <div className="mb-7">
              <div className="flex gap-3 justify-center">
                {(["admin", "doctor", "patient"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={getRoleStyles(role)}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {submitError && (
                <div className="rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {submitError}
                </div>
              )}

              {successMessage && (
                <div className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  {successMessage}
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-wide uppercase medflow-auth-label">
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="cliniyaAdmin"
                  className="rounded-lg h-11 border transition-all medflow-auth-input focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-wide uppercase medflow-auth-label">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="rounded-lg h-11 border pr-10 transition-all medflow-auth-input focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors medflow-auth-icon-muted"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    className="rounded cursor-pointer accent-blue-500 medflow-auth-checkbox"
                    {...register("remember")}
                  />
                  <span className="medflow-auth-muted">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium transition-colors medflow-auth-accent"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-md font-semibold text-sm transition-all cursor-pointer bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-600/30"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm mt-6 medflow-auth-muted">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold transition-colors medflow-auth-accent">
                Register
              </Link>
            </p>

            {/* Social Login */}
            <SocialLogin isDarkMode={theme === "dark"} />
          </div>

          {/* Right Side - Illustration */}
          <Illustration isDarkMode={theme === "dark"} />
        </div>
      </div>
    </div>
  );
}
