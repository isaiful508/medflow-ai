"use client";

import { X } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Pending" | "Critical";
  lastVisit: string;
  doctor: string;
  notes: string;
};

export type PatientForm = {
  name: string;
  email: string;
  phone: string;
  status: Patient["status"];
  lastVisit: string;
  doctor: string;
  notes: string;
};

interface CreatePatientProps {
  form: PatientForm;
  setForm: Dispatch<SetStateAction<PatientForm>>;
  editingPatient: Patient | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export function CreatePatient({ form, setForm, editingPatient, onSubmit, onClose }: CreatePatientProps) {
  const isEditing = Boolean(editingPatient?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-(--mc-border) bg-(--mc-card) p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{isEditing ? "Edit patient" : "Add patient"}</p>
            <p className="mt-1 text-sm text-(--mc-text-40)">{isEditing ? "Update patient details below." : "Create a new patient record."}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-(--mc-border) p-2 text-(--mc-text-50)">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid gap-3 md:grid-cols-2">
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
            <Button type="submit">{isEditing ? "Save changes" : "Add patient"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
