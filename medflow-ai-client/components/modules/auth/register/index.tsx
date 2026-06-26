"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Phone, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/services/AuthService";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { useTheme } from "@/hooks/useTheme";
import Illustration from "../Illustration";
import SocialLogin from "../socialLogin";

type UserRole = "doctor" | "patient";

export default function RegisterForm() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");

  const radioClass = (role: UserRole) =>
    `flex-1 flex items-center justify-center gap-2 rounded-lg h-11 text-sm font-semibold transition-all ${
      selectedRole === role
        ? role === "doctor"
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40"
          : "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
        : "medflow-auth-inactive hover:opacity-80"
    }`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
      role: "patient",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setSubmitError("");
    setSuccessMessage("");

    const result = await registerUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      mobile: data.mobile,
      role: selectedRole,
    });

    setIsLoading(false);

    if (result instanceof Error) {
      setSubmitError(result.message || "Unable to create account.");
      return;
    }

    if (!result.success) {
      setSubmitError(result.message || "Unable to create account.");
      return;
    }

    setSuccessMessage(result.message || "Registration successful. You can sign in now.");
    window.setTimeout(() => {
      router.push("/login");
    }, 1000);
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
                <span className="text-xl font-bold tracking-tight">
                  <span className="medflow-auth-accent">Medflow</span>AI
                </span>
              </div>
              <p className="text-xs tracking-wide medflow-auth-muted">
                Your trusted telemedicine platform
              </p>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Create your account</h1>
              <p className="text-sm medflow-auth-muted">
                Start your journey with MedflowAI
              </p>
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

              {/* Full Name */}
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-wide uppercase medflow-auth-label">
                  Full name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="rounded-lg h-11 border transition-all medflow-auth-input focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-wide uppercase medflow-auth-label">
                  Phone number
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    className="rounded-lg h-11 border transition-all medflow-auth-input pr-10 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                    {...register("mobile")}
                  />
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 medflow-auth-icon-muted" />
                </div>
                {errors.mobile && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.mobile.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-wide uppercase medflow-auth-label">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="rounded-lg h-11 border transition-all medflow-auth-input focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Role (radio) */}
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-wide uppercase medflow-auth-label">
                  Register as
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("patient")}
                    className={radioClass("patient")}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={selectedRole === "patient"}
                      readOnly
                      className="h-4 w-4 cursor-pointer accent-blue-600"
                    />
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("doctor")}
                    className={radioClass("doctor")}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={selectedRole === "doctor"}
                      readOnly
                      className="h-4 w-4 cursor-pointer accent-orange-500"
                    />
                    Doctor
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block mb-2 text-xs font-semibold tracking-wide uppercase medflow-auth-label">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="rounded-lg h-11 border transition-all medflow-auth-input pr-10 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors medflow-auth-icon-muted"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block mb-2 text-xs font-semibold tracking-wide uppercase medflow-auth-label">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="rounded-lg h-11 border transition-all medflow-auth-input pr-10 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors medflow-auth-icon-muted"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  className="mt-1 rounded cursor-pointer accent-blue-500 medflow-auth-checkbox"
                  {...register("terms")}
                />
                <span className="text-sm medflow-auth-muted">
                  I agree to the{" "}
                  <span className="medflow-auth-accent">terms and conditions</span>
                </span>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-500">{errors.terms.message}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-md font-semibold text-sm transition-all cursor-pointer bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-600/30"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm mt-6 medflow-auth-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold transition-colors medflow-auth-accent">
                Sign in
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
