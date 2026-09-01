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