import { Model } from "mongoose";

export type TPatient = {
  patientId?: number;
  userId?: number;
  fullName: string;
  email: string;
  phone: string;
  status: "Active" | "Pending" | "Critical";
  lastVisit: string;
  doctor: string;
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PatientModel = Model<TPatient>;
