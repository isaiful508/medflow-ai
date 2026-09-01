"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable/data-table";
import type { Patient } from "./CreatePatient";

interface PatientListsTableProps {
  patients: Patient[];
  columns: ColumnDef<Patient>[];
  onRowClick: (patient: Patient) => void;
}

export function PatientListsTable({ patients, columns, onRowClick }: PatientListsTableProps) {
  return (
    <div className="p-5">
      <DataTable search placeholder="Search patients..." data={patients} columns={columns} onRowClick={onRowClick} />
    </div>
  );
}
