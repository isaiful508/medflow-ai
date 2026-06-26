"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/AuthService";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useUser } from "@/context/UserContext";

type UserRole = "admin" | "doctor" | "patient";

interface LoginFormWithRole extends LoginFormValues {
  role: UserRole;
}

function getTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export default function LoginForm() {
  const router = useRouter();
  const { handleUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [isDarkMode, setIsDarkMode] = useState(getTheme() === "dark");

  useEffect(() => {
    const sync = () => setIsDarkMode(getTheme() === "dark");
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onStorage = () => sync();
    window.addEventListener("storage", onStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggleTheme = () => {
    const next = isDarkMode ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("medflow-ai-theme", next);
    } catch {}
    setIsDarkMode(next === "dark");
  };

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
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                    isDarkMode ? "bg-gradient-to-br from-blue-600 to-blue-800" : "bg-gradient-to-br from-blue-500 to-blue-700"
                  }`}
                >
                  M
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
            <div className="mb-8">
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
              <p
                className={`text-xs font-semibold mb-3 tracking-wide uppercase ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Select Role
              </p>
              <div className="flex gap-3">
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
                className={`w-full h-11 rounded-lg font-semibold text-sm transition-all ${
                  isDarkMode
                    ? "bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-900/30"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-600/30"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Signing in...
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
                Sign up
              </Link>
            </p>

            {/* Social Login */}
            <div className="mt-6 pt-6">
              <div
                className={`flex items-center gap-3 mb-5 ${
                  isDarkMode ? "opacity-60" : "opacity-50"
                }`}
              >
                <div
                  className={`flex-1 h-px ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  }`}
                />
                <span
                  className={`text-xs uppercase tracking-wide ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Or continue with
                </span>
                <div
                  className={`flex-1 h-px ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  }`}
                />
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div
            className={`hidden lg:flex flex-1 items-center justify-center ${
              isDarkMode
                ? "bg-gradient-to-b from-amber-100 to-orange-100"
                : "bg-gradient-to-b from-amber-50 to-orange-50"
            } relative overflow-hidden`}
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-orange-400 blur-3xl" />
              <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-yellow-400 blur-3xl" />
            </div>

            {/* Illustration Placeholder */}
            <div className="relative z-10 text-center">
              <svg
                viewBox="0 0 200 200"
                className="w-48 h-48 mx-auto"
              >
                {/* Sun */}
                <circle cx="150" cy="40" r="30" fill="currentColor" className="text-yellow-400" />

                {/* Boat */}
                <ellipse cx="100" cy="120" rx="60" ry="15" fill="currentColor" className="text-teal-700" />

                {/* Sail */}
                <polygon points="100,120 100,40 150,120" fill="currentColor" className="text-yellow-600" />
                <polygon points="100,120 100,55 70,120" fill="currentColor" className="text-amber-700" />

                {/* Person */}
                <circle cx="95" cy="100" r="6" fill="currentColor" className="text-amber-800" />
                <line x1="95" y1="106" x2="95" y2="125" stroke="currentColor" strokeWidth="3" className="text-amber-800" />
                <line x1="85" y1="110" x2="105" y2="110" stroke="currentColor" strokeWidth="3" className="text-amber-800" />

                {/* Water waves */}
                <path d="M 20 140 Q 30 135 40 140 T 60 140" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-600" opacity="0.5" />
                <path d="M 120 140 Q 130 135 140 140 T 160 140" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-600" opacity="0.5" />

                {/* Birds */}
                <path d="M 40 50 Q 50 45 60 50" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-gray-700" />
                <path d="M 160 60 Q 170 55 180 60" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-gray-700" />
              </svg>

              <p
                className={`mt-6 text-lg font-semibold ${
                  isDarkMode ? "text-gray-800" : "text-gray-700"
                }`}
              >
                Welcome to MedflowAI
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-600" : "text-gray-500"
                }`}
              >
                Your trusted telemedicine partner
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}