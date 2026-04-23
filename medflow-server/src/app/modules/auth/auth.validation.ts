import { z } from "zod";

const userRoleSchema = z.enum(["patient", "doctor", "admin"], {
  errorMap: () => ({
    message: "Role must be patient, doctor, or admin",
  }),
});

export const registerValidationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Valid email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  mobile: z.string().trim().min(5, "Mobile number is required"),
  role: userRoleSchema,
  terms: z.boolean().optional(),
});

export const loginValidationSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});
