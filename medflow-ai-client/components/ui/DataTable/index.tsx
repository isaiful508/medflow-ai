"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const tableVariants = cva("w-full border-collapse", {
  variants: {
    variant: {
      default: "border border-(--mc-border) bg-(--mc-card)",
      transparent: "border-none bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type TableProps = React.ComponentPropsWithRef<"table"> & VariantProps<typeof tableVariants>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, ...props }, ref) => (
    <table ref={ref} className={cn(tableVariants({ variant }), className)} {...props} />
  ),
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b border-(--mc-border) transition hover:bg-(--mc-soft)", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableHeaderCellElement,
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-(--mc-text-30)",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-3 align-middle text-sm text-(--mc-text-80)", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";
