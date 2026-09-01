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
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchDoctors, createDoctor as createDoctorThunk, deleteDoctor, updateDoctorLocal } from "@/store/doctorSlice";

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
  const dispatch = useDispatch<AppDispatch>();
  const doctors = useSelector((s: RootState) => s.doctors.list);

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
    void dispatch(fetchDoctors());
  }, [dispatch]);

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
      dispatch(updateDoctorLocal({ ...editingDoctor, ...form }));
      closeModal();
      return;
    }

    // --- CREATE ---
    const password = generateSecurePassword(6);

    try {
      const response = await dispatch(createDoctorThunk({
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
      } as Record<string, unknown>);

      const resultAction = await response;
      if (createDoctorThunk.fulfilled.match(resultAction)) {
        closeModal();
        setCredentials({ email: form.email, password });
      } else {
        const err = (resultAction.payload as string) || "Doctor creation failed.";
        throw new Error(err);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to create doctor";
      console.error(message);
      toast.error(message);
    }
  };

  const handleDeleteConfirm = () => {
    if (!doctorToDelete) return;
    void dispatch(deleteDoctor({ id: doctorToDelete.id }));
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
        <DoctorListsTable doctors={doctors} columns={doctorColumns} onRowClick={openEditModal} />
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