import { Schema, model } from "mongoose";
import { TDoctor, DoctorModel } from "./doctor.interface";

const doctorSchema = new Schema<TDoctor, DoctorModel>(
  {
    doctorId: {
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
    specialty: {
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
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
      default: "Male",
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    department: {
      type: String,
      default: "",
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Available", "Busy", "On leave"],
      default: "Available",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Doctor = model<TDoctor, DoctorModel>("Doctor", doctorSchema);

export default Doctor;
