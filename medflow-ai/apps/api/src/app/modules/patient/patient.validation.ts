import { z } from "zod";

export const createPatientValidationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  status: z.enum(["Active", "Pending", "Critical"]).optional().default("Active"),
  lastVisit: z.string().trim().optional().default(""),
  doctor: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});
