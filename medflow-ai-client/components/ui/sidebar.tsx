import * as React from "react";
import { cn } from "@/lib/utils";

export function Sidebar({
  collapsed,
  children,
  className,
}: {
  collapsed?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "relative z-10 hidden shrink-0 border-r data-[theme=light]:border-slate-200 data-[theme=dark]:border-white/10 data-[theme=light]:bg-white/6 data-[theme=dark]:bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 md:flex md:flex-col",
        collapsed ? "w-[72px]" : "w-[240px]",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 border-b data-[theme=light]:border-slate-200 data-[theme=dark]:border-white/10 px-4 py-4", className)}>
      {children}
    </div>
  );
}

export function SidebarContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 space-y-1 overflow-y-auto px-2 py-3", className)}>
      {children}
    </div>
  );
}

export function SidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t data-[theme=light]:border-slate-200 data-[theme=dark]:border-white/10 p-3", className)}>{children}</div>
  );
}

export function SidebarTrigger({
  onClick,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("ml-auto data-[theme=light]:text-slate-700 text-white/55 transition data-[theme=light]:hover:text-slate-900 hover:text-white", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-1", className)}>{children}</div>;
}

export function SidebarMenuItem({
  active,
  className,
  children,
  ...props
}: {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
        active
          ? "bg-blue-500/15 text-blue-400"
          : "data-[theme=light]:text-slate-700 text-white/60 data-[theme=light]:hover:bg-slate-100/60 hover:bg-white/6 data-[theme=light]:hover:text-slate-900 hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarMenuBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
