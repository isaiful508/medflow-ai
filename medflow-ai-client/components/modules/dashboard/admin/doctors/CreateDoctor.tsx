"use client";

import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import type { Doctor, DoctorForm } from "./types";



export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  licenseNumber: string;
  qualification: string;
  experienceYears: number;
  department: string;
  consultationFee: number;
  availability: string;
  status: "Available" | "Busy" | "On leave";
};

export type DoctorForm = Omit<Doctor, "id">;

// Only exists in memory between "doctor created" and "admin closed the modal"
export type DoctorCredentials = {
  email: string;
  password: string;
};

export const initialDoctorForm: DoctorForm = {
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


interface CreateDoctorProps {
  form: DoctorForm;
  setForm: Dispatch<SetStateAction<DoctorForm>>;
  editingDoctor: Doctor | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const STEPS = ["Personal", "Professional", "Practice & Access"] as const;

export function CreateDoctor({ form, setForm, editingDoctor, onSubmit, onClose }: CreateDoctorProps) {
  const isEditing = Boolean(editingDoctor?.id);
  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length - 1;

  // Per-step required fields — block "Next" until these are filled
  const stepErrors = useMemo(() => {
    if (step === 0) {
      const errs: string[] = [];
      if (!form.name.trim()) errs.push("name");
      if (!form.email.trim()) errs.push("email");
      if (!form.phone.trim()) errs.push("phone");
      return errs;
    }
    if (step === 1) {
      const errs: string[] = [];
      if (!form.specialty.trim()) errs.push("specialty");
      if (!form.licenseNumber.trim()) errs.push("licenseNumber");
      if (!form.qualification.trim()) errs.push("qualification");
      return errs;
    }
    return [];
  }, [step, form]);

  const goNext = () => {
    if (stepErrors.length > 0) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLastStep) {
      goNext();
      return;
    }
    onSubmit(event);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-(--mc-border) bg-(--mc-card) p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{isEditing ? "Edit doctor" : "Add doctor"}</p>
            <p className="mt-1 text-sm text-(--mc-text-40)">
              {isEditing ? "Update doctor details below." : "Create a new doctor profile."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-(--mc-border) p-2 text-(--mc-text-50)">
            <X className="size-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="mt-5 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                      ? "border-primary text-primary"
                      : "border-(--mc-border) text-(--mc-text-40)"
                }`}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? "font-medium" : "text-(--mc-text-40)"}`}>{label}</span>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-(--mc-border)" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          {/* Step 1: Personal */}
          {step === 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Full name"
                required
              />
              <select
                value={form.gender}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value as Doctor["gender"] }))}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email — used for login"
                required
                disabled={isEditing}
              />
              <Input
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone"
                required
              />
              {isEditing && (
                <p className="text-xs text-(--mc-text-40) md:col-span-2">
                  Email can&apos;t be changed after creation since it&apos;s tied to login credentials.
                </p>
              )}
            </div>
          )}

          {/* Step 2: Professional */}
          {step === 1 && (
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={form.specialty}
                onChange={(e) => setForm((prev) => ({ ...prev, specialty: e.target.value }))}
                placeholder="Specialty (e.g. Cardiology)"
                required
              />
              <Input
                value={form.department}
                onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                placeholder="Department"
              />
              <Input
                value={form.licenseNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                placeholder="Medical license number"
                required
              />
              <Input
                value={form.qualification}
                onChange={(e) => setForm((prev) => ({ ...prev, qualification: e.target.value }))}
                placeholder="Qualification (e.g. MBBS, MD)"
                required
              />
              <Input
                type="number"
                min={0}
                value={form.experienceYears || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, experienceYears: Number(e.target.value) }))}
                placeholder="Years of experience"
              />
            </div>
          )}

          {/* Step 3: Practice & Access */}
          {step === 2 && (
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={form.availability}
                onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
                placeholder="Availability (e.g. Mon-Fri, 9am-5pm)"
              />
              <Input
                type="number"
                min={0}
                value={form.consultationFee || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, consultationFee: Number(e.target.value) }))}
                placeholder="Consultation fee"
              />
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Doctor["status"] }))}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none md:col-span-2"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="On leave">On leave</option>
              </select>
              {!isEditing && (
                <p className="rounded-lg border border-(--mc-border) bg-(--mc-card) p-3 text-xs text-(--mc-text-40) md:col-span-2">
                  A login password will be generated automatically for <strong>{form.email || "this doctor"}</strong> and
                  shown once after creation. Make sure you&apos;re ready to copy it down.
                </p>
              )}
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-6 flex items-center justify-between gap-2">
            <div>
              {step > 0 && (
                <Button type="button" variant="outline" onClick={goBack}>
                  <ChevronLeft className="size-4" /> Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={stepErrors.length > 0}>
                {isLastStep ? (isEditing ? "Save changes" : "Create doctor") : (
                  <>
                    Next <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}