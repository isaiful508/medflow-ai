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
  const { isDark: isDarkMode, toggleTheme } = useTheme();
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
        : isDarkMode
          ? "bg-gray-700/40 text-gray-300 hover:opacity-80"
          : "bg-gray-200 text-gray-600 hover:opacity-80"
    }`;

  const labelColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const inputClass =
    "rounded-lg h-11 border transition-all " +
    (isDarkMode
      ? "border-gray-700 bg-gray-700/50 text-white placeholder:text-gray-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
      : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20");

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
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 medflow-ai-grid relative overflow-hidden ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
      style={{ backgroundSize: "40px 40px" }}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
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
                Create your account
              </h1>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Start your journey with MedflowAI
              </p>
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

              {/* Full Name */}
              <div>
                <label
                  className={`block mb-2 text-xs font-semibold tracking-wide uppercase ${labelColor}`}
                >
                  Full name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  className={inputClass}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  className={`block mb-2 text-xs font-semibold tracking-wide uppercase ${labelColor}`}
                >
                  Phone number
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    className={`${inputClass} pr-10`}
                    {...register("mobile")}
                  />
                  <Phone className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                </div>
                {errors.mobile && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.mobile.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block mb-2 text-xs font-semibold tracking-wide uppercase ${labelColor}`}
                >
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Role (radio) */}
              <div>
                <label
                  htmlFor="role"
                  className={`block mb-2 text-xs font-semibold tracking-wide uppercase ${labelColor}`}
                >
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
                  <label
                    className={`block mb-2 text-xs font-semibold tracking-wide uppercase ${labelColor}`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`${inputClass} pr-10`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                        isDarkMode
                          ? "text-gray-500 hover:text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
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
                  <label
                    className={`block mb-2 text-xs font-semibold tracking-wide uppercase ${labelColor}`}
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`${inputClass} pr-10`}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                        isDarkMode
                          ? "text-gray-500 hover:text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
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
                  className={`mt-1 rounded cursor-pointer accent-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600" : ""}`}
                  {...register("terms")}
                />
                <span
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  I agree to the{" "}
                  <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
                    terms and conditions
                  </span>
                </span>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-500">{errors.terms.message}</p>
              )}

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
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <p
              className={`text-center text-sm mt-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className={`font-semibold transition-colors ${
                  isDarkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Log in
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
