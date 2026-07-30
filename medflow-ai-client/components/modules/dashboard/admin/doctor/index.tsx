"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, GlassCard } from "@/components/shared/ui-helpers";
import { createActionColumn, useCrudDialog } from "../../admin-list-utils";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { CreateDoctor, type Doctor, type DoctorForm } from "./CreateDoctor";
import { DoctorListsTable } from "./DoctorListsTable";

const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Kapoor",
    specialty: "Neurologist",
    email: "priya.kapoor@medflow.ai",
    phone: "+1 202 555 0198",
    availability: "Available today",
    status: "Available",
  },
  {
    id: 2,
    name: "Dr. Michael Reed",
    specialty: "Cardiologist",
    email: "michael.reed@medflow.ai",
    phone: "+1 202 555 0121",
    availability: "Tomorrow morning",
    status: "Busy",
  },
  {
    id: 3,
    name: "Dr. Aisha Loren",
    specialty: "Dermatologist",
    email: "aisha.loren@medflow.ai",
    phone: "+1 202 555 0177",
    availability: "Next week",
    status: "On leave",
  },
];

const emptyForm: DoctorForm = {
  name: "",
  specialty: "",
  email: "",
  phone: "",
  availability: "",
  status: "Available",
};

export function Doctor() {
  const [doctors, setDoctors] = useState(initialDoctors);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email) return;

    if (editingDoctor) {
      setDoctors((current) => current.map((doctor) => (doctor.id === editingDoctor.id ? { ...doctor, ...form, id: doctor.id } : doctor)));
    } else {
      setDoctors((current) => [{ ...form, id: Date.now() }, ...current]);
    }

    closeModal();
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
    </div>
  );
}
