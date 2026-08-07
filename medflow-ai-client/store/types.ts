export type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  bloodGroup: string;
  status: "Active" | "Pending" | "Critical";
  lastVisit: string;
  doctor: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
};

export type Doctor = {
  id: number;
  name: string;
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
};
