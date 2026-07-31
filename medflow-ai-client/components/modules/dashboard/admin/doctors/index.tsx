"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, GlassCard } from "@/components/shared/ui-helpers";
import { createActionColumn, useCrudDialog } from "../../admin-list-utils";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { CreateDoctor, type Doctor, type DoctorForm } from "./CreateDoctor";
import { DoctorCredentialsModal } from "./CredentialsModal";
import { DoctorListsTable } from "./DoctorListsTable";
import { generateSecurePassword } from "@/lib/generatePassword";

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

    // Replace with your real API call, e.g.:
    // const res = await fetch("/api/doctors", { method: "POST", body: JSON.stringify({ ...form, password }) });
    // const created: Doctor = await res.json();
    const created: Doctor = { ...form, id: Date.now() };

    setDoctors((current) => [created, ...current]);
    closeModal();

    // Show credentials exactly once. Nothing else in the app holds onto
    // this password after the modal closes — admin must save it now.
    setCredentials({ email: form.email, password });
  };

  const handleDeleteConfirm = () => {
    if (!doctorToDelete) return;
    setDoctors((current) => current.filter((doctor) => doctor.id !== doctorToDelete.id));
    closeDeleteDialog();
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <CardHeader title="Doctor list" />
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--mc-border) px-5 py-4">
          <div>
            <p className="text-sm font-medium">Doctor roster</p>
            <p className="text-xs text-(--mc-text-40)">Manage medical staff from a single table view.</p>
          </div>
          <Button type="button" onClick={openCreateModal} className="gap-2">
            <Plus className="size-4" />
            Add doctor
          </Button>
        </div>
        <DoctorListsTable doctors={doctors} columns={doctorColumns} onRowClick={openEditModal} />
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