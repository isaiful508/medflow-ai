export * from "./user";
export * from "./auth";

export type PatientStatus = "Active" | "Pending" | "Critical";
export type PatientGender = "Male" | "Female" | "Other";

export type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: PatientGender;
  dateOfBirth: string;
  bloodGroup: string;
  status: PatientStatus;
  lastVisit: string;
  doctor: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
};

export type PatientForm = Omit<Patient, "id">;

export type DoctorStatus = "Available" | "Busy" | "On leave";
export type DoctorGender = "Male" | "Female" | "Other";

export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  gender: DoctorGender;
  licenseNumber: string;
  qualification: string;
  experienceYears: number;
  department: string;
  consultationFee: number;
  availability: string;
  status: DoctorStatus;
};

export type DoctorForm = Omit<Doctor, "id">;

export type OneTimeCredentials = {
  email: string;
  password: string;
};

export type DoctorCredentials = OneTimeCredentials;

