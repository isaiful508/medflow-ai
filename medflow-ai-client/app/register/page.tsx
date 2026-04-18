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
  Lock,
  Mail,
  User,
  Phone,
  Stethoscope,
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      role: "patient", // default selected
    },
  });

  const password = watch("password");
  const termsAccepted = watch("terms");

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);

    console.log("Register Data:", data);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="rounded-[8px] p-6">
          <CardHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-14 h-14 rounded-[8px] bg-primary flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>

              <div className="text-center">
                <h1 className="text-xl font-semibold">Create Account</h1>
                <p className="text-sm text-muted-foreground">
                  Register to get started
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block mb-1 text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="p-6 rounded-[4px]"
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm">Email</label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="p-6 rounded-[4px]"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block mb-1 text-sm">Mobile</label>
                <div className="relative">
                  <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="p-6 rounded-[4px]"
                    {...register("mobile", {
                      required: "Mobile number is required",
                      minLength: {
                        value: 10,
                        message: "Invalid number",
                      },
                    })}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* Role - Radio */}
              <div>
                <label className="block mb-2 text-sm">Role</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="patient"
                      {...register("role", { required: true })}
                    />
                    Patient
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="doctor"
                      {...register("role")}
                    />
                    Doctor
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="admin"
                      {...register("role")}
                    />
                    Admin
                  </label>
                </div>

                {errors.role && (
                  <p className="text-xs text-red-500 mt-1">
                    Role is required
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="p-6 rounded-[4px]"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 text-sm">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="p-6 rounded-[4px]"
                    {...register("confirmPassword", {
                      required: "Confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  {...register("terms", {
                    required: "You must accept terms",
                  })}
                />
                <label>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.terms.message}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isLoading || !termsAccepted}
              >
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}