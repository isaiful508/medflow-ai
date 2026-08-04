import bcrypt from "bcrypt";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import config from "../../config";
import { getNextSequenceValue } from "../counter/counter.utils";
import Patient from "./patient.model";
import User from "../user/user.model";
import { TPatient } from "./patient.interface";

export type CreatePatientPayload = {
  fullName: string;
  email: string;
  phone: string;
  status: "Active" | "Pending" | "Critical";
  lastVisit: string;
  doctor: string;
  notes: string;
  password?: string;
};

const createPatient = async (payload: CreatePatientPayload) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists with this email");
  }

  const existingPatient = await Patient.findOne({ email: payload.email });

  if (existingPatient) {
    throw new AppError(httpStatus.CONFLICT, "Patient already exists with this email");
  }

  const nextUserId = await getNextSequenceValue("userId");
  const nextPatientId = await getNextSequenceValue("patientId");

  const password = payload.password ?? "Medflow@123";
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  const user = await User.create({
    userId: nextUserId,
    fullName: payload.fullName,
    email: payload.email,
    password: hashedPassword,
    mobile: payload.phone,
    role: "patient",
    termsAccepted: true,
  });

  const patient = await Patient.create({
    patientId: nextPatientId,
    userId: nextUserId,
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    status: payload.status,
    lastVisit: payload.lastVisit,
    doctor: payload.doctor,
    notes: payload.notes,
  });

  return {
    user: {
      id: nextUserId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
    },
    patient: {
      id: nextPatientId,
      fullName: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      status: patient.status,
      lastVisit: patient.lastVisit,
      doctor: patient.doctor,
      notes: patient.notes,
    },
  };
};

const getAllPatients = async () => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  return patients.map((patient) => ({
    id: patient.patientId,
    userId: patient.userId,
    fullName: patient.fullName,
    email: patient.email,
    phone: patient.phone,
    status: patient.status,
    lastVisit: patient.lastVisit,
    doctor: patient.doctor,
    notes: patient.notes,
  }));
};

export const PatientService = {
  createPatient,
  getAllPatients,
};
