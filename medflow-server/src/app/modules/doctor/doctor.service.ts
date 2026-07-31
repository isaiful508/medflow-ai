import bcrypt from "bcrypt";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import config from "../../config";
import { getNextSequenceValue } from "../counter/counter.utils";
import Doctor from "./doctor.model";
import User from "../user/user.model";
import { TDoctor } from "./doctor.interface";

export type CreateDoctorPayload = {
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
  password?: string;
};

const createDoctor = async (payload: CreateDoctorPayload) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists with this email");
  }

  const existingDoctor = await Doctor.findOne({ email: payload.email });

  if (existingDoctor) {
    throw new AppError(httpStatus.CONFLICT, "Doctor already exists with this email");
  }

  const password = payload.password ?? "Medflow@123";
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  const nextUserId = await getNextSequenceValue("userId");
  const nextDoctorId = await getNextSequenceValue("doctorId");

  const user = await User.create({
    userId: nextUserId,
    fullName: payload.fullName,
    email: payload.email,
    password: hashedPassword,
    mobile: payload.phone,
    role: "doctor",
    termsAccepted: true,
  });

  const doctor = await Doctor.create({
    doctorId: nextDoctorId,
    userId: nextUserId,
    fullName: payload.fullName,
    specialty: payload.specialty,
    email: payload.email,
    phone: payload.phone,
    gender: payload.gender,
    licenseNumber: payload.licenseNumber,
    qualification: payload.qualification,
    experienceYears: payload.experienceYears,
    department: payload.department,
    consultationFee: payload.consultationFee,
    availability: payload.availability,
    status: payload.status,
  });

  return {
    user: {
      id: nextUserId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
    },
    doctor: {
      id: nextDoctorId,
      fullName: doctor.fullName,
      specialty: doctor.specialty,
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender,
      licenseNumber: doctor.licenseNumber,
      qualification: doctor.qualification,
      experienceYears: doctor.experienceYears,
      department: doctor.department,
      consultationFee: doctor.consultationFee,
      availability: doctor.availability,
      status: doctor.status,
    },
    password,
  };
};

export const DoctorService = {
  createDoctor,
};
