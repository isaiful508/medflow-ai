"use client";

import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { CellContext, ColumnDef } from "@tanstack/react-table";

export function useCrudDialog<T, TForm>(
  emptyForm: TForm,
  getFormFromItem: (item: T) => TForm,
) {
  const [form, setForm] = useState<TForm>(emptyForm);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
  }, [emptyForm]);

  const openCreateModal = useCallback(() => {
    setEditingItem(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }, [emptyForm]);

  const openEditModal = useCallback(
    (item: T) => {
      setEditingItem(item);
      setForm(getFormFromItem(item));
      setIsModalOpen(true);
    },
    [getFormFromItem],
  );

  const openDeleteDialog = useCallback((item: T) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setItemToDelete(null);
    setIsDeleteDialogOpen(false);
  }, []);

  return {
    form,
    setForm,
    editingItem,
    isModalOpen,
    isDeleteDialogOpen,
    itemToDelete,
    closeModal,
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    closeDeleteDialog,
  };
}

export function createActionColumn<T>(
  openEditModal: (item: T) => void,
  openDeleteDialog: (item: T) => void,
): ColumnDef<T, unknown> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }: CellContext<T, unknown>) => (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openEditModal(row.original);
          }}
          className="rounded-lg border border-(--mc-border) p-2 text-(--mc-text-60)"
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openDeleteDialog(row.original);
          }}
          className="rounded-lg border border-rose-500/30 p-2 text-rose-400"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    ),
  };
}
