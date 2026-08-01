"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable/data-table";
import type { Doctor } from "./CreateDoctor";

interface DoctorListsTableProps {
  doctors: Doctor[];
  columns: ColumnDef<Doctor>[];
  onRowClick: (doctor: Doctor) => void;
}

export function DoctorListsTable({ doctors, columns, onRowClick }: DoctorListsTableProps) {
  return (
      <DataTable
      search placeholder="Search doctors..."
      data={doctors}
      columns={columns}
      onRowClick={onRowClick}
      />
  );
}
