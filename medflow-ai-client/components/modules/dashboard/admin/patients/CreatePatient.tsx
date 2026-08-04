"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  bloodGroup: string;
  status: "Active" | "Pending" | "Critical";
  lastVisit: string;
  doctor: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
};

export type PatientForm = Omit<Patient, "id">;

const STEPS = ["Personal", "Medical", "Visit & notes"] as const;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

interface CreatePatientProps {
  form: PatientForm;
  setForm: Dispatch<SetStateAction<PatientForm>>;
  editingPatient: Patient | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreatePatient({
  form,
  setForm,
  editingPatient,
  onSubmit,
  onClose,
  open = true,
  onOpenChange,
}: CreatePatientProps) {
  const isEditing = Boolean(editingPatient?.id);
  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length - 1;

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
      if (!form.doctor.trim()) errs.push("doctor");
      return errs;
    }
    return [];
  }, [form, step]);

  const goNext = () => {
    if (stepErrors.length > 0) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLastStep) {
      goNext();
      return;
    }
    onSubmit(event);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit patient" : "Add patient"}
      description={isEditing ? "Update patient details below." : "Create a new patient record."}
      footer={
        <>
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={goBack}>
              <ChevronLeft className="size-4" /> Back
            </Button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="patient-form" disabled={stepErrors.length > 0}>
              {isLastStep ? (isEditing ? "Save changes" : "Add patient") : (
                <>
                  Next <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </>
      }
    >
      <div className="mt-4 flex items-center gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                index < step
                  ? "border-primary bg-primary text-primary-foreground"
                  : index === step
                  ? "border-primary text-primary"
                  : "border-(--mc-border) text-(--mc-text-40)"
              }`}
            >
              {index < step ? <Check className="size-3.5" /> : index + 1}
            </div>
            <span className={`text-xs ${index === step ? "font-medium" : "text-(--mc-text-40)"}`}>{label}</span>
            {index < STEPS.length - 1 && <div className="h-px flex-1 bg-(--mc-border)" />}
          </div>
        ))}
      </div>

      <form id="patient-form" onSubmit={handleSubmit} className="mt-5">
        {/* Step 1: Personal */}
        {step === 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Patient name"
              required
            />
            <select
              value={form.gender}
              onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value as Patient["gender"] }))}
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={(event) => setForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
              placeholder="Date of birth"
            />
            <Input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email — used for portal login"
              required
              disabled={isEditing}
            />
            <Input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
              required
            />
            {isEditing && (
              <p className="text-xs text-(--mc-text-40) md:col-span-2">
                Email can&apos;t be changed after creation since it&apos;s tied to portal login credentials.
              </p>
            )}
          </div>
        )}

        {/* Step 2: Medical */}
        {step === 1 && (
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={form.bloodGroup}
              onChange={(event) => setForm((prev) => ({ ...prev, bloodGroup: event.target.value }))}
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none"
            >
              <option value="">Blood group</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <Input
              value={form.doctor}
              onChange={(event) => setForm((prev) => ({ ...prev, doctor: event.target.value }))}
              placeholder="Assigned doctor"
              required
            />
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as Patient["status"] }))}
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Critical">Critical</option>
            </select>
            <Input
              value={form.allergies}
              onChange={(event) => setForm((prev) => ({ ...prev, allergies: event.target.value }))}
              placeholder="Known allergies (optional)"
            />
          </div>
        )}

        {/* Step 3: Visit & notes */}
        {step === 2 && (
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              type="date"
              value={form.lastVisit}
              onChange={(event) => setForm((prev) => ({ ...prev, lastVisit: event.target.value }))}
              placeholder="Last visit"
            />
            <div />
            <Input
              value={form.emergencyContactName}
              onChange={(event) => setForm((prev) => ({ ...prev, emergencyContactName: event.target.value }))}
              placeholder="Emergency contact name"
            />
            <Input
              value={form.emergencyContactPhone}
              onChange={(event) => setForm((prev) => ({ ...prev, emergencyContactPhone: event.target.value }))}
              placeholder="Emergency contact phone"
            />
            <textarea
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Clinical notes"
              className="min-h-24 w-full rounded-xl border border-(--mc-border) bg-transparent px-3 py-2 text-sm outline-none md:col-span-2"
            />
            {!isEditing && (
              <p className="rounded-lg border border-(--mc-border) bg-(--mc-card) p-3 text-xs text-(--mc-text-40) md:col-span-2">
                A portal login password will be generated automatically for <strong>{form.email || "this patient"}</strong> and
                shown once after creation. Make sure you&apos;re ready to copy it down.
              </p>
            )}
          </div>
        )}
      </form>
    </Dialog>
  );
}