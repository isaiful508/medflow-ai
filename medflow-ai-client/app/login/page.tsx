"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, Stethoscope } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // navigate('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated blobs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.2) 50%, transparent 100%)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div className="w-full max-w-md relative z-10">
        <Card className="border-2 border-primary/20 shadow-2xl backdrop-blur-md bg-card/98">
          
          <CardHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>

              <div className="text-center">
                <h1 className="mb-2 text-xl font-semibold">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground text-sm">
                  Sign in to continue
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email */}
              <div>
                <label className="block mb-2 text-sm">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Remember me
                </label>

                <Link href="/forgot-password" className="text-primary">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full rounded-4xl" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/register" className="text-primary">
                Sign up
              </Link>
            </p>

          </CardContent>
        </Card>
      </motion.div>
    </div>
    // <div className="flex min-h-screen items-center justify-center bg-gray-50">
    //   <form
    //     onSubmit={handleSubmit}
    //     className="w-full max-w-sm space-y-4 rounded bg-white p-8 shadow-lg"
    //   >
    //     <h1 className="text-2xl font-bold text-center">Login</h1>
    //     <div>
    //       <Input
    //         placeholder="Email"
    //         type="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <Input
    //         placeholder="Password"
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <Button type="submit" className="w-full">
    //       Sign In
    //     </Button>
    //     <p className="text-center text-sm text-gray-600">
    //       Don't have an account?{' '}
    //       <a href="/register" className="text-primary underline">
    //         Register
    //       </a>
    //     </p>
    //   </form>
    // </div>
  );
}
