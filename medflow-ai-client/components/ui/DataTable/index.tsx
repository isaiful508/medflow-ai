"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const tableVariants = cva("w-full border-collapse", {
  variants: {
    variant: {
      default: "bg-(--mc-card) border border-(--mc-border)",
      transparent: "border-none bg-transparent",
      striped: "bg-(--mc-card) border border-(--mc-border)",
    },
    size: {
      default: "",
      sm: "text-xs",
      lg: "text-sm",
    },
  },
  compoundVariants: [
    {
      variant: "striped",
      className: "& tbody tr:nth-child(even):bg-(--mc-soft)",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type TableProps = React.ComponentPropsWithRef<"table"> & VariantProps<typeof tableVariants>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, size, ...props }, ref) => (
    <table
      ref={ref}
      className={cn(tableVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-(--mc-soft) border-b border-(--mc-border) sticky top-0 z-10",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("divide-y divide-(--mc-border)", className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition-colors duration-150",
      "hover:bg-(--mc-soft)",
      "data-[state=selected]:bg-(--accent)",
      "data-[state=selected]:hover:bg-(--accent)",
      selected && "bg-(--accent)",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLThElement,
  React.ThHTMLAttributes<HTMLThElement> & { sortable?: boolean }
>(({ className, sortable, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-(--mc-text-50)",
      "whitespace-nowrap",
      sortable && "cursor-pointer select-none hover:text-(--mc-fg) transition-colors",
      className,
    )}
    {...props}
  >
    {children}
  </th>
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 align-middle text-sm text-(--mc-text-80)",
      "transition-colors duration-150",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("px-4 py-3 text-sm text-(--mc-text-50) text-left", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-(--mc-soft) border-t border-(--mc-border) sticky bottom-0 z-10",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";