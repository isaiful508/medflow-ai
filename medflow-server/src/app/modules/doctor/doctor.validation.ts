import { z } from "zod";

export const createDoctorValidationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  specialty: z.string().trim().min(1, "Specialty is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  licenseNumber: z.string().trim().min(1, "License number is required"),
  qualification: z.string().trim().min(1, "Qualification is required"),
  experienceYears: z.coerce.number().min(0).optional().default(0),
  department: z.string().trim().optional().default(""),
  consultationFee: z.coerce.number().min(0).optional().default(0),
  availability: z.string().trim().optional().default(""),
  status: z.enum(["Available", "Busy", "On leave"]).optional().default("Available"),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});
