"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader, GlassCard } from "@/components/shared/ui-helpers";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: string;
  status: "Available" | "Busy" | "On leave";
};

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

const emptyForm = {
  name: "",
  specialty: "",
  email: "",
  phone: "",
  availability: "",
  status: "Available" as Doctor["status"],
};

export function AdminDoctorsScreen() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [form, setForm] = useState(emptyForm);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
    setForm(emptyForm);
  };

  const openCreateModal = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.name,
      specialty: doctor.specialty,
      email: doctor.email,
      phone: doctor.phone,
      availability: doctor.availability,
      status: doctor.status,
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDoctorToDelete(null);
  };

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
        <div className="overflow-x-auto p-5">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--mc-border) text-(--mc-text-40)">
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Specialty</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Availability</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="border-b border-(--mc-border)/70 last:border-b-0">
                  <td className="px-3 py-3 font-medium text-(--mc-fg)">{doctor.name}</td>
                  <td className="px-3 py-3 text-(--mc-text-50)">{doctor.specialty}</td>
                  <td className="px-3 py-3 text-(--mc-text-50)">{doctor.email}</td>
                  <td className="px-3 py-3 text-(--mc-text-50)">{doctor.availability}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs text-blue-300">{doctor.status}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEditModal(doctor)} className="rounded-lg border border-(--mc-border) p-2 text-(--mc-text-60)"><Pencil className="size-4" /></button>
                      <button type="button" onClick={() => openDeleteDialog(doctor)} className="rounded-lg border border-rose-500/30 p-2 text-rose-400"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-(--mc-border) bg-(--mc-card) p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{editingDoctor ? "Edit doctor" : "Add doctor"}</p>
                <p className="mt-1 text-sm text-(--mc-text-40)">{editingDoctor ? "Update doctor details below." : "Create a new doctor profile."}</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-full border border-(--mc-border) p-2 text-(--mc-text-50)">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-3 md:grid-cols-2">
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
                <Button type="submit">{editingDoctor ? "Save changes" : "Add doctor"}</Button>
                <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
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
