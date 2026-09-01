import { Schema, model } from "mongoose";
import { TPatient, PatientModel } from "./patient.interface";

const patientSchema = new Schema<TPatient, PatientModel>(
  {
    patientId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    userId: {
      type: Number,
      sparse: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Critical"],
      default: "Active",
    },
    lastVisit: {
      type: String,
      default: "",
      trim: true,
    },
    doctor: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Patient = model<TPatient, PatientModel>("Patient", patientSchema);

export default Patient;
