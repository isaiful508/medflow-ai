"use client";

import { X } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: string;
  status: "Available" | "Busy" | "On leave";
};

export type DoctorForm = {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: string;
  status: Doctor["status"];
};

interface CreateDoctorProps {
  form: DoctorForm;
  setForm: Dispatch<SetStateAction<DoctorForm>>;
  editingDoctor: Doctor | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export function CreateDoctor({ form, setForm, editingDoctor, onSubmit, onClose }: CreateDoctorProps) {
  const isEditing = Boolean(editingDoctor?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-(--mc-border) bg-(--mc-card) p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{isEditing ? "Edit doctor" : "Add doctor"}</p>
            <p className="mt-1 text-sm text-(--mc-text-40)">{isEditing ? "Update doctor details below." : "Create a new doctor profile."}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-(--mc-border) p-2 text-(--mc-text-50)">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid gap-3 md:grid-cols-2">
          <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Doctor name" required />
          <Input value={form.specialty} onChange={(event) => setForm((prev) => ({ ...prev, specialty: event.target.value }))} placeholder="Specialty" required />
          <Input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" required />
          <Input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone" />
          <Input value={form.availability} onChange={(event) => setForm((prev) => ({ ...prev, availability: event.target.value }))} placeholder="Availability" />
          <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as Doctor["status"] }))} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none">
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="On leave">On leave</option>
          </select>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit">{isEditing ? "Save changes" : "Add doctor"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
