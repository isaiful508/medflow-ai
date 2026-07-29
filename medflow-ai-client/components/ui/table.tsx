import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type TableProps = React.ComponentPropsWithRef<"table"> & VariantProps<typeof tableVariants>;
type TableSectionProps = React.ComponentPropsWithRef<"thead"> | React.ComponentPropsWithRef<"tbody">;
type TableRowProps = React.ComponentPropsWithRef<"tr">;
type TableCellProps = React.ComponentPropsWithRef<"td">;
type TableHeaderCellProps = React.ComponentPropsWithRef<"th">;

const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    variant: {
      default: "",
      compact: "text-xs",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, ...props }, ref) => (
    <table ref={ref} className={cn(tableVariants({ variant }), className)} {...props} />
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("bg-(--mc-soft)", className)} {...props} />
  ),
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("divide-y divide-(--mc-border)/70", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "transition-colors duration-200 hover:bg-(--mc-soft) data-[state=selected]:bg-(--mc-soft)",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-(--mc-text-40)",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("px-4 py-4 align-middle text-sm text-(--mc-text-70)", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
