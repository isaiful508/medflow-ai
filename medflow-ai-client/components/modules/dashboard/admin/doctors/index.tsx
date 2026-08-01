"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/ui-helpers";
import { createActionColumn, useCrudDialog } from "../../admin-list-utils";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { CreateDoctor, type Doctor, type DoctorForm } from "./CreateDoctor";
import { DoctorCredentialsModal } from "./CredentialsModal";
import { DoctorListsTable } from "./DoctorListsTable";
import { generateSecurePassword } from "@/lib/generatePassword";
import API from "@/lib/api";

export type DoctorCredentials = {
  email: string;
  password: string;
};

const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Kapoor",
    specialty: "Neurologist",
    email: "priya.kapoor@medflow.ai",
    phone: "+1 202 555 0198",
    gender: "Female",
    licenseNumber: "MD-10293",
    qualification: "MBBS, MD",
    experienceYears: 9,
    department: "Neurology",
    consultationFee: 80,
    availability: "Available today",
    status: "Available",
  },
  {
    id: 2,
    name: "Dr. Michael Reed",
    specialty: "Cardiologist",
    email: "michael.reed@medflow.ai",
    phone: "+1 202 555 0121",
    gender: "Male",
    licenseNumber: "MD-88213",
    qualification: "MBBS, DM Cardiology",
    experienceYears: 14,
    department: "Cardiology",
    consultationFee: 120,
    availability: "Tomorrow morning",
    status: "Busy",
  },
  {
    id: 3,
    name: "Dr. Aisha Loren",
    specialty: "Dermatologist",
    email: "aisha.loren@medflow.ai",
    phone: "+1 202 555 0177",
    gender: "Female",
    licenseNumber: "MD-55621",
    qualification: "MBBS, MD Dermatology",
    experienceYears: 6,
    department: "Dermatology",
    consultationFee: 60,
    availability: "Next week",
    status: "On leave",
  },
  {
    id: 4,
    name: "Dr. Ethan Brooks",
    specialty: "Orthopedic Surgeon",
    email: "ethan.brooks@medflow.ai",
    phone: "+1 202 555 0134",
    gender: "Male",
    licenseNumber: "MD-77291",
    qualification: "MBBS, MS Orthopedics",
    experienceYears: 11,
    department: "Orthopedics",
    consultationFee: 95,
    availability: "Available today",
    status: "Available",
  },
  {
    id: 5,
    name: "Dr. Sophia Chen",
    specialty: "Pediatrician",
    email: "sophia.chen@medflow.ai",
    phone: "+1 202 555 0145",
    gender: "Female",
    licenseNumber: "MD-44512",
    qualification: "MBBS, MD Pediatrics",
    experienceYears: 8,
    department: "Pediatrics",
    consultationFee: 70,
    availability: "Today afternoon",
    status: "Available",
  },
  {
    id: 6,
    name: "Dr. James Wilson",
    specialty: "General Physician",
    email: "james.wilson@medflow.ai",
    phone: "+1 202 555 0162",
    gender: "Male",
    licenseNumber: "MD-33894",
    qualification: "MBBS, MD Internal Medicine",
    experienceYears: 12,
    department: "General Medicine",
    consultationFee: 65,
    availability: "Tomorrow evening",
    status: "Busy",
  },
  {
    id: 7,
    name: "Dr. Emma Rodriguez",
    specialty: "Gynecologist",
    email: "emma.rodriguez@medflow.ai",
    phone: "+1 202 555 0189",
    gender: "Female",
    licenseNumber: "MD-67381",
    qualification: "MBBS, MS Obstetrics & Gynecology",
    experienceYears: 10,
    department: "Gynecology",
    consultationFee: 90,
    availability: "Available today",
    status: "Available",
  },
  {
    id: 8,
    name: "Dr. Daniel Kim",
    specialty: "Psychiatrist",
    email: "daniel.kim@medflow.ai",
    phone: "+1 202 555 0118",
    gender: "Male",
    licenseNumber: "MD-12947",
    qualification: "MBBS, MD Psychiatry",
    experienceYears: 7,
    department: "Psychiatry",
    consultationFee: 85,
    availability: "Friday morning",
    status: "Available",
  },
  {
    id: 9,
    name: "Dr. Olivia Parker",
    specialty: "Ophthalmologist",
    email: "olivia.parker@medflow.ai",
    phone: "+1 202 555 0156",
    gender: "Female",
    licenseNumber: "MD-59102",
    qualification: "MBBS, MS Ophthalmology",
    experienceYears: 13,
    department: "Ophthalmology",
    consultationFee: 100,
    availability: "Next Monday",
    status: "Busy",
  },
  {
    id: 10,
    name: "Dr. Noah Bennett",
    specialty: "ENT Specialist",
    email: "noah.bennett@medflow.ai",
    phone: "+1 202 555 0109",
    gender: "Male",
    licenseNumber: "MD-28465",
    qualification: "MBBS, MS ENT",
    experienceYears: 5,
    department: "ENT",
    consultationFee: 55,
    availability: "Available today",
    status: "Available",
  },
];

const emptyForm: DoctorForm = {
  name: "",
  specialty: "",
  email: "",
  phone: "",
  gender: "Male",
  licenseNumber: "",
  qualification: "",
  experienceYears: 0,
  department: "",
  consultationFee: 0,
  availability: "",
  status: "Available",
};

export function Doctors() {
  const [doctors, setDoctors] = useState(initialDoctors);

  // Lives ONLY in memory, only between "just created" and "admin closed the modal"
  const [credentials, setCredentials] = useState<DoctorCredentials | null>(null);

  const {
    form,
    setForm,
    editingItem: editingDoctor,
    isModalOpen,
    isDeleteDialogOpen,
    itemToDelete: doctorToDelete,
    closeModal,
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    closeDeleteDialog,
  } = useCrudDialog<Doctor, DoctorForm>(emptyForm, (doctor) => ({
    name: doctor.name,
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
  }));

  const doctorColumns = useMemo<ColumnDef<Doctor>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }: CellContext<Doctor, string>) => <span className="font-medium text-(--mc-fg)">{getValue()}</span>,
      },
      {
        accessorKey: "specialty",
        header: "Specialty",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "department",
        header: "Department",
      },
      {
        accessorKey: "availability",
        header: "Availability",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }: CellContext<Doctor, string>) => (
          <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs text-blue-300">{getValue()}</span>
        ),
      },
      createActionColumn(openEditModal, openDeleteDialog),
    ],
    [openDeleteDialog, openEditModal],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email) return;

    if (editingDoctor) {
      // --- UPDATE (no password involved) ---
      // Replace with your real API call, e.g.:
      // await fetch(`/api/doctors/${editingDoctor.id}`, { method: "PATCH", body: JSON.stringify(form) });
      setDoctors((current) => current.map((doctor) => (doctor.id === editingDoctor.id ? { ...doctor, ...form, id: doctor.id } : doctor)));
      closeModal();
      return;
    }

    // --- CREATE ---
    const password = generateSecurePassword(6);

    try {
      const response = await API.post("/doctors", {
        fullName: form.name,
        specialty: form.specialty,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        licenseNumber: form.licenseNumber,
        qualification: form.qualification,
        experienceYears: form.experienceYears,
        department: form.department,
        consultationFee: form.consultationFee,
        availability: form.availability,
        status: form.status,
        password,
      });

      const createdDoctor = response.data?.data?.doctor;
      const doctorForTable: Doctor = {
        id: createdDoctor?.id ?? Date.now(),
        name: createdDoctor?.fullName ?? form.name,
        specialty: createdDoctor?.specialty ?? form.specialty,
        email: createdDoctor?.email ?? form.email,
        phone: createdDoctor?.phone ?? form.phone,
        gender: createdDoctor?.gender ?? form.gender,
        licenseNumber: createdDoctor?.licenseNumber ?? form.licenseNumber,
        qualification: createdDoctor?.qualification ?? form.qualification,
        experienceYears: createdDoctor?.experienceYears ?? form.experienceYears,
        department: createdDoctor?.department ?? form.department,
        consultationFee: createdDoctor?.consultationFee ?? form.consultationFee,
        availability: createdDoctor?.availability ?? form.availability,
        status: createdDoctor?.status ?? form.status,
      };

      setDoctors((current) => [doctorForTable, ...current]);
      closeModal();
      setCredentials({ email: form.email, password });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to create doctor";
      console.error(message);
      alert(message);
    }
  };

  const handleDeleteConfirm = () => {
    if (!doctorToDelete) return;
    setDoctors((current) => current.filter((doctor) => doctor.id !== doctorToDelete.id));
    closeDeleteDialog();
  };

  return (
    <div className="space-y-4">
      <GlassCard>
          <Button type="button" onClick={openCreateModal} className="gap-2">
            <Plus className="size-4" />
            Add doctor
          </Button>
        <DoctorListsTable
          doctors={doctors}
          columns={doctorColumns}
          onRowClick={openEditModal}
        />
      </GlassCard>

      {isModalOpen ? (
        <CreateDoctor form={form} setForm={setForm} editingDoctor={editingDoctor} onSubmit={handleSubmit} onClose={closeModal} />
      ) : null}

      {isDeleteDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-(--mc-border) bg-(--mc-card) p-6 shadow-2xl">
            <p className="text-lg font-semibold">Delete doctor</p>
            <p className="mt-2 text-sm text-(--mc-text-40)">This action will remove {doctorToDelete?.name ?? "this doctor"} from the table. Continue?</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDeleteDialog}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
            </div>
          </div>
        </div>
      ) : null}

      {credentials ? (
        <DoctorCredentialsModal
          credentials={credentials}
          onClose={() => setCredentials(null)} // gone for good, no way back in
        />
      ) : null}
    </div>
  );
}