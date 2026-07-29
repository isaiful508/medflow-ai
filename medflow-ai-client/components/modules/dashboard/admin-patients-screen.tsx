"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { CardHeader, GlassCard } from "@/components/shared/ui-helpers";
import { createActionColumn, useCrudDialog } from "./admin-list-utils";
import type { ColumnDef } from "@tanstack/react-table";

type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Pending" | "Critical";
  lastVisit: string;
  doctor: string;
  notes: string;
};

const initialPatients: Patient[] = [
  {
    id: 1,
    name: "Ava Collins",
    email: "ava.collins@medflow.ai",
    phone: "+1 202 555 0148",
    status: "Active",
    lastVisit: "2026-07-10",
    doctor: "Dr. Priya Kapoor",
    notes: "Routine follow-up and medication review.",
  },
  {
    id: 2,
    name: "Noah Patel",
    email: "noah.patel@medflow.ai",
    phone: "+1 202 555 0184",
    status: "Pending",
    lastVisit: "2026-06-28",
    doctor: "Dr. Michael Reed",
    notes: "Awaiting cardiology assessment.",
  },
  {
    id: 3,
    name: "Mia Thompson",
    email: "mia.thompson@medflow.ai",
    phone: "+1 202 555 0162",
    status: "Critical",
    lastVisit: "2026-07-12",
    doctor: "Dr. Aisha Loren",
    notes: "Recent lab anomaly requires urgent review.",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  status: "Active" as Patient["status"],
  lastVisit: "",
  doctor: "",
  notes: "",
};

export function AdminPatientsScreen() {
  const [patients, setPatients] = useState(initialPatients);

  type PatientForm = typeof emptyForm;

  const {
    form,
    setForm,
    editingItem: editingPatient,
    isModalOpen,
    isDeleteDialogOpen,
    itemToDelete: patientToDelete,
    closeModal,
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    closeDeleteDialog,
  } = useCrudDialog<Patient, PatientForm>(emptyForm, (patient) => ({
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    status: patient.status,
    lastVisit: patient.lastVisit,
    doctor: patient.doctor,
    notes: patient.notes,
  }));

  const patientColumns = useMemo<ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }: CellContext<Patient, string>) => <span className="font-medium text-(--mc-fg)">{getValue()}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }: CellContext<Patient, string>) => (
          <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs text-blue-300">{getValue()}</span>
        ),
      },
      {
        accessorKey: "lastVisit",
        header: "Last visit",
      },
      createActionColumn(openEditModal, openDeleteDialog),
    ],
    [openDeleteDialog, openEditModal],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name || !form.email) return;

    if (editingPatient) {
      setPatients((current) =>
        current.map((patient) => (patient.id === editingPatient.id ? { ...patient, ...form, id: patient.id } : patient)),
      );
    } else {
      setPatients((current) => [{ ...form, id: Date.now() }, ...current]);
    }

    closeModal();
  };

  const handleDeleteConfirm = () => {
    if (!patientToDelete) return;
    setPatients((current) => current.filter((patient) => patient.id !== patientToDelete.id));
    closeDeleteDialog();
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <CardHeader title="Patient list" />
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--mc-border) px-5 py-4">
          <div>
            <p className="text-sm font-medium">Patient records</p>
            <p className="text-xs text-(--mc-text-40)">Manage patients from a single table view.</p>
          </div>
          <Button type="button" onClick={openCreateModal} className="gap-2">
            <Plus className="size-4" />
            Add patient
          </Button>
        </div>
        <div className="p-5">
          <DataTable
            search
            placeholder="Search patients..."
            data={patients}
            columns={patientColumns}
          />
        </div>
      </GlassCard>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-(--mc-border) bg-(--mc-card) p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{editingPatient ? "Edit patient" : "Add patient"}</p>
                <p className="mt-1 text-sm text-(--mc-text-40)">{editingPatient ? "Update patient details below." : "Create a new patient record."}</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-full border border-(--mc-border) p-2 text-(--mc-text-50)">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-3 md:grid-cols-2">
              <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Patient name" required />
              <Input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" required />
              <Input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone" />
              <Input value={form.lastVisit} onChange={(event) => setForm((prev) => ({ ...prev, lastVisit: event.target.value }))} placeholder="Last visit" />
              <Input value={form.doctor} onChange={(event) => setForm((prev) => ({ ...prev, doctor: event.target.value }))} placeholder="Assigned doctor" />
              <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as Patient["status"] }))} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none">
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Critical">Critical</option>
              </select>
              <textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Clinical notes" className="min-h-24 rounded-xl border border-(--mc-border) bg-transparent px-3 py-2 text-sm outline-none md:col-span-2" />
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit">{editingPatient ? "Save changes" : "Add patient"}</Button>
                <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isDeleteDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-(--mc-border) bg-(--mc-card) p-6 shadow-2xl">
            <p className="text-lg font-semibold">Delete patient</p>
            <p className="mt-2 text-sm text-(--mc-text-40)">This action will remove {patientToDelete?.name ?? "this patient"} from the table. Continue?</p>
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
