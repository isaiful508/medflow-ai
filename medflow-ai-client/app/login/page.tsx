"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, Stethoscope } from "lucide-react";


type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);

    console.log("Form Data:", data);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    // router.push("/dashboard");
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
                <h1 className="text-xl font-semibold">Welcome Back</h1>
                <p className="text-sm text-muted-foreground">
                  Sign in to continue
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Email</label>
                <div className="relative">
                  <Mail className="absolute left-1 right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="p-6 rounded-[4px]"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
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

              <div>
                <label className="block mb-1 text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register("remember")} />
                  Remember me
                </label>

                <Link href="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

            </form>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}