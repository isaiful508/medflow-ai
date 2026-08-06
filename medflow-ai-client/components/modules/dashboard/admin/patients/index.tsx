"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CardHeader, GlassCard } from "@/components/shared/ui-helpers";
import { createActionColumn, useCrudDialog } from "../../admin-list-utils";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { CreatePatient, type Patient, type PatientForm } from "./CreatePatient";
import { CredentialsRevealModal, type OneTimeCredentials } from "./CredentialsModal";
import { generateSecurePassword } from "@/lib/generatePassword";
import { createPatient, getPatients } from "@/services/PatientsService";
import { PatientListsTable } from "./PatientListsTable";

const emptyForm: PatientForm = {
  name: "",
  email: "",
  phone: "",
  gender: "Male",
  dateOfBirth: "",
  bloodGroup: "",
  status: "Active",
  lastVisit: "",
  doctor: "",
  allergies: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  notes: "",
};

export function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  // Lives ONLY in memory, only between "just created" and "admin closed the modal"
  const [credentials, setCredentials] = useState<OneTimeCredentials | null>(null);

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
    gender: patient.gender,
    dateOfBirth: patient.dateOfBirth,
    bloodGroup: patient.bloodGroup,
    status: patient.status,
    lastVisit: patient.lastVisit,
    doctor: patient.doctor,
    allergies: patient.allergies,
    emergencyContactName: patient.emergencyContactName,
    emergencyContactPhone: patient.emergencyContactPhone,
    notes: patient.notes,
  }));

  useEffect(() => {
    const loadPatients = async () => {
      const response = await getPatients();

      if (!response.success) {
        toast.error(response.message || "Unable to load patients");
        return;
      }

      const payload = response.data as unknown;
      const patientList = Array.isArray(payload)
        ? payload
        : ((payload as { patients?: unknown[] })?.patients ?? []);

      const mappedPatients: Patient[] = (patientList as Record<string, unknown>[]).map((patient) => ({
        id: Number(patient.id ?? Date.now()),
        name: String(patient.fullName ?? patient.name ?? ""),
        email: String(patient.email ?? ""),
        phone: String(patient.phone ?? ""),
        gender: (patient.gender as Patient["gender"]) ?? "Male",
        dateOfBirth: String(patient.dateOfBirth ?? ""),
        bloodGroup: String(patient.bloodGroup ?? ""),
        status: (patient.status as Patient["status"]) ?? "Active",
        lastVisit: String(patient.lastVisit ?? ""),
        doctor: String(patient.doctor ?? ""),
        allergies: String(patient.allergies ?? ""),
        emergencyContactName: String(patient.emergencyContactName ?? ""),
        emergencyContactPhone: String(patient.emergencyContactPhone ?? ""),
        notes: String(patient.notes ?? ""),
      }));

      setPatients(mappedPatients);
    };

    void loadPatients();
  }, []);

  const patientColumns = useMemo<ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }: CellContext<Patient, string>) => <span className="font-medium text-(--mc-fg)">{getValue()}</span>,
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "doctor", header: "Assigned doctor" },
      { accessorKey: "bloodGroup", header: "Blood group" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }: CellContext<Patient, string>) => (
          <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs text-blue-300">{getValue()}</span>
        ),
      },
      { accessorKey: "lastVisit", header: "Last visit" },
      createActionColumn(openEditModal, openDeleteDialog),
    ],
    [openDeleteDialog, openEditModal],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email) return;

    if (editingPatient) {
      // --- UPDATE (no password involved) ---
      setPatients((current) =>
        current.map((patient) => (patient.id === editingPatient.id ? { ...patient, ...form, id: patient.id } : patient)),
      );
      closeModal();
      return;
    }

    // --- CREATE ---
    const password = generateSecurePassword(6);

    try {
      const response = await createPatient({
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        status: form.status,
        lastVisit: form.lastVisit,
        doctor: form.doctor,
        notes: form.notes,
        password,
      });

      if (!response.success) {
        throw new Error(response.message || "Patient creation failed.");
      }

      const createdPatient = (response.data as Record<string, unknown> | undefined)?.patient as
        | (Record<string, unknown> & { id?: number; fullName?: string; email?: string; phone?: string; status?: Patient["status"]; lastVisit?: string; doctor?: string; notes?: string })
        | undefined;

      if (!createdPatient) {
        throw new Error("Patient creation failed. No patient returned.");
      }

      const patientForTable: Patient = {
        id: createdPatient?.id ?? Date.now(),
        name: createdPatient?.fullName ?? form.name,
        email: createdPatient?.email ?? form.email,
        phone: createdPatient?.phone ?? form.phone,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        bloodGroup: form.bloodGroup,
        status: createdPatient?.status ?? form.status,
        lastVisit: createdPatient?.lastVisit ?? form.lastVisit,
        doctor: createdPatient?.doctor ?? form.doctor,
        allergies: form.allergies,
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
        notes: createdPatient?.notes ?? form.notes,
      };

      setPatients((current) => [patientForTable, ...current]);
      closeModal();
      setCredentials({ email: form.email, password });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to create patient";
      console.error(message);
      toast.error(message);
    }
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
        <CreatePatient
          form={form}
          setForm={setForm}
          editingPatient={editingPatient}
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
            <p className="text-lg font-semibold">Delete patient</p>
            <p className="mt-2 text-sm text-(--mc-text-40)">This action will remove {patientToDelete?.name ?? "this patient"} from the table. Continue?</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDeleteDialog}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
            </div>
          </div>
        </div>
      ) : null}

      {credentials ? (
        <CredentialsRevealModal
          credentials={credentials}
          roleLabel="patient"
          onClose={() => setCredentials(null)}
        />
      ) : null}
    </div>
  );
}