"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, GlassCard } from "@/components/shared/ui-helpers";
import { createActionColumn, useCrudDialog } from "../../admin-list-utils";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { CreatePatient, type Patient, type PatientForm } from "./CreatePatient";
import { PatientListsTable } from "./PatientListsTable";

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

const emptyForm: PatientForm = {
  name: "",
  email: "",
  phone: "",
  status: "Active",
  lastVisit: "",
  doctor: "",
  notes: "",
};

export function Patients() {
  const [patients, setPatients] = useState(initialPatients);

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
      setPatients((current) => current.map((patient) => (patient.id === editingPatient.id ? { ...patient, ...form, id: patient.id } : patient)));
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
        <PatientListsTable patients={patients} columns={patientColumns} onRowClick={openEditModal} />
      </GlassCard>

      {isModalOpen ? (
        <CreatePatient form={form} setForm={setForm} editingPatient={editingPatient} onSubmit={handleSubmit} onClose={closeModal} />
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
