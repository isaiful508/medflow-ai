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