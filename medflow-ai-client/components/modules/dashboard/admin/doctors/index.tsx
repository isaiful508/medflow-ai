"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/ui-helpers";
import { createActionColumn, useCrudDialog } from "../../admin-list-utils";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { CreateDoctor, type Doctor, type DoctorForm } from "./CreateDoctor";
import { DoctorCredentialsModal } from "./CredentialsModal";
import { DoctorListsTable } from "./DoctorListsTable";
import { generateSecurePassword } from "@/lib/generatePassword";
import { createDoctor, getDoctors } from "@/services/DoctorsService";

export type DoctorCredentials = {
  email: string;
  password: string;
};

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
  const [doctors, setDoctors] = useState<Doctor[]>([]);

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

  useEffect(() => {
    const loadDoctors = async () => {
      const response = await getDoctors();

      if (!response.success) {
        toast.error(response.message || "Unable to load doctors");
        return;
      }

      const payload = response.data as unknown;
      const doctorList = Array.isArray(payload)
        ? payload
        : ((payload as { doctors?: unknown[] })?.doctors ?? []);

      const mappedDoctors: Doctor[] = (doctorList as Record<string, unknown>[]).map((doctor) => ({
        id: Number(doctor.id ?? Date.now()),
        name: String(doctor.fullName ?? doctor.name ?? ""),
        specialty: String(doctor.specialty ?? ""),
        email: String(doctor.email ?? ""),
        phone: String(doctor.phone ?? ""),
        gender: (doctor.gender as Doctor["gender"]) ?? "Male",
        licenseNumber: String(doctor.licenseNumber ?? ""),
        qualification: String(doctor.qualification ?? ""),
        experienceYears: Number(doctor.experienceYears ?? 0),
        department: String(doctor.department ?? ""),
        consultationFee: Number(doctor.consultationFee ?? 0),
        availability: String(doctor.availability ?? ""),
        status: (doctor.status as Doctor["status"]) ?? "Available",
      }));

      setDoctors(mappedDoctors);
    };

    void loadDoctors();
  }, []);

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
      const response = await createDoctor({
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

      if (!response.success) {
        throw new Error(response.message || "Doctor creation failed.");
      }

      const createdDoctor = (response.data as Record<string, unknown> | undefined)?.doctor as
        | (Record<string, unknown> & { id?: number; fullName?: string; specialty?: string; email?: string; phone?: string; gender?: Doctor["gender"]; licenseNumber?: string; qualification?: string; experienceYears?: number; department?: string; consultationFee?: number; availability?: string; status?: Doctor["status"] })
        | undefined;

      if (!createdDoctor) {
        throw new Error("Doctor creation failed. No doctor returned.");
      }

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
      toast.error(message);
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
          <div className="flex  justify-end">
            <Button type="button" onClick={openCreateModal} className="gap-2">
            <Plus className="size-4" />
            Add doctor
          </Button> 
          </div>
        <DoctorListsTable
          doctors={doctors}
          columns={doctorColumns}
          onRowClick={openEditModal}
        />
      </GlassCard>

      {isModalOpen ? (
        <CreateDoctor
          form={form}
          setForm={setForm}
          editingDoctor={editingDoctor}
          onSubmit={handleSubmit}
          onClose={closeModal}
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        />
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