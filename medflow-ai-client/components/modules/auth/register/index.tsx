  "use client";

  import { useState } from "react";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm, useWatch } from "react-hook-form";
  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import { Eye, EyeOff, Mail, Phone, Stethoscope, User } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { registerUser } from "@/service/AuthService";
  import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";

  function PasswordStrength({ password }: { password: string }) {
    const getStrength = (value: string) => {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
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
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                index < score ? segColors[score] : "bg-white/10"
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

  export default function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
      register,
      control,
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

    const password = useWatch({ control, name: "password" }) ?? "";
    const termsAccepted = useWatch({ control, name: "terms" }) ?? false;

    const onSubmit = async (data: RegisterFormValues) => {
      setIsLoading(true);
      setSubmitError("");
      setSuccessMessage("");

      const result = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
        role: data.role,
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

    const handleGoogleRegister = async () => {
      setGoogleLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setGoogleLoading(false);
    };

    const roles = [
      { value: "patient", label: "Patient", icon: "👤" },
      { value: "doctor", label: "Doctor", icon: "🩺" },
      { value: "admin", label: "Admin", icon: "🛡️" },
    ] as const;

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

        <div className="relative z-10 w-full max-w-md px-4">
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

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-[11.5px]">or register with email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                      Full name
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="rounded-[8px] border-white/[0.12] bg-white/[0.07] text-white placeholder:text-white/25 h-11 px-4"
                        {...register("fullName")}
                      />
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-400 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                      Email address
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="rounded-[8px] border-white/[0.12] bg-white/[0.07] text-white placeholder:text-white/25 h-11 px-4"
                        {...register("email")}
                      />
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        className="rounded-[8px] border-white/[0.12] bg-white/[0.07] text-white placeholder:text-white/25 h-11 px-4 pr-12"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="rounded-[8px] border-white/[0.12] bg-white/[0.07] text-white placeholder:text-white/25 h-11 px-4 pr-12"
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                      Mobile
                    </label>
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="1234567890"
                        className="rounded-[8px] border-white/[0.12] bg-white/[0.07] text-white placeholder:text-white/25 h-11 px-4"
                        {...register("mobile")}
                      />
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    </div>
                    {errors.mobile && (
                      <p className="text-xs text-red-400 mt-1">{errors.mobile.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1.5 text-[11px] font-medium text-white/60 tracking-wide uppercase">
                      Role
                    </label>
                    <select
                      className="mt-2 w-full rounded-[8px] border border-white/[0.12] bg-white/[0.07] text-white px-4 py-3"
                      {...register("role")}
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                    {errors.role && (
                      <p className="text-xs text-red-400 mt-1">{errors.role.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-white/70">
                  <input
                    type="checkbox"
                    className="mt-2 h-4 w-4 rounded border-white/20 bg-slate-950 text-sky-500 focus:ring-sky-400"
                    {...register("terms")}
                  />
                  <span>
                    I agree to the <span className="text-sky-400">terms and conditions</span>.
                  </span>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-400">{errors.terms.message}</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-[8px] bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition-all"
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-white/40">
                Already have an account?{' '}
                <Link href="/login" className="text-sky-400 hover:text-sky-300">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
