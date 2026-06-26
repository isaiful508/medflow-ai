"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/AuthService";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/hooks/useTheme";
import Illustration from "../Illustration";
import SocialLogin from "../socialLogin";

type UserRole = "admin" | "doctor" | "patient";

interface LoginFormWithRole extends LoginFormValues {
  role: UserRole;
}

export default function LoginForm() {
  const router = useRouter();
  const { handleUser } = useUser();
  const { isDark: isDarkMode, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

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
    return `${baseClass} ${isDarkMode ? "bg-gray-700/40 text-gray-300" : "bg-gray-200 text-gray-600"} hover:opacity-80`;
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 medflow-ai-grid relative overflow-hidden ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
      style={{ backgroundSize: "40px 40px" }}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`fixed top-6 right-6 z-20 p-2 rounded-lg transition-colors duration-200 ${
            isDarkMode
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        {/* Main Card */}
        <div
          className={`rounded-2xl overflow-hidden shadow-2xl flex transition-all duration-300 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Left Side - Form */}
          <div
            className={`flex-1 p-10 lg:p-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          >
            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
                <span
                  className={`text-xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
                    Medflow
                  </span>
                  AI
                </span>
              </div>
              <p
                className={`text-xs tracking-wide ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Your trusted telemedicine platform
              </p>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1
                className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Sign in
              </h1>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Enter your credentials to log in
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-7">
              <div className="flex gap-3 justify-center">
                {(["admin", "doctor", "patient"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
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
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    isDarkMode
                      ? "border-red-400/25 bg-red-500/10 text-red-300"
                      : "border-red-400/50 bg-red-50 text-red-700"
                  }`}
                >
                  {submitError}
                </div>
              )}

              {successMessage && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    isDarkMode
                      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
                      : "border-emerald-400/50 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {successMessage}
                </div>
              )}

              {/* Username Input */}
              <div>
                <label
                  className={`block mb-2 text-xs font-semibold tracking-wide uppercase ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="cliniyaAdmin"
                  className={`rounded-lg h-11 border transition-all ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700/50 text-white placeholder:text-gray-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                      : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label
                  className={`block mb-2 text-xs font-semibold tracking-wide uppercase ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`rounded-lg h-11 border pr-10 transition-all ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700/50 text-white placeholder:text-gray-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                      isDarkMode
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
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
                    className={`rounded cursor-pointer accent-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600" : ""}`}
                    {...register("remember")}
                  />
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-11 rounded-md font-semibold text-sm transition-all cursor-pointer ${
                  isDarkMode
                    ? "bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-900/30"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-600/30"
                }`}
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
            <p
              className={`text-center text-sm mt-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className={`font-semibold transition-colors ${
                  isDarkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Register
              </Link>
            </p>

            {/* Social Login */}
            <SocialLogin isDarkMode={isDarkMode} />
          </div>

          {/* Right Side - Illustration */}
          <Illustration isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}