import { z } from "zod";

const roles = ["patient", "doctor"] as const;

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Minimum 6 characters"),
  remember: z.boolean(),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Invalid email"),
    password: z
      .string()
      .min(6, "Min 6 characters")
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[0-9]/, "Add at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    mobile: z
      .string()
      .trim()
      .min(10, "Invalid number"),
    role: z.enum(roles),
    terms: z.boolean().refine((value) => value, {
      message: "You must accept terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
