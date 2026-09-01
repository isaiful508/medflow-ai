import { Model } from "mongoose";

export type TDoctor = {
  doctorId?: number;
  userId?: number;
  fullName: string;
  specialty: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  licenseNumber: string;
  qualification: string;
  experienceYears: number;
  department: string;
  consultationFee: number;
  availability: string;
  status: "Available" | "Busy" | "On leave";
  createdAt?: Date;
  updatedAt?: Date;
};

export type DoctorModel = Model<TDoctor>;
