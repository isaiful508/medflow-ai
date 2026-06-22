import { navItems, type NavItem, type UserRole } from "@/lib/medflow-ai-data";

export function getVisibleNavItems(userRole?: string): NavItem[] {
  const normalizedRole = (userRole?.toLowerCase() || "patient") as UserRole;
  
  return navItems.filter((item) => {
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true;
    }
    return item.requiredRoles.includes(normalizedRole);
  });
}

export function isRouteAllowed(userRole?: string, href?: string): boolean {
  const normalizedRole = (userRole?.toLowerCase() || "patient") as UserRole;
  const item = navItems.find((nav) => nav.href === href);
  
  if (!item) return true; // Allow unknown routes (will be handled by page component)
  if (!item.requiredRoles || item.requiredRoles.length === 0) return true;
  
  return item.requiredRoles.includes(normalizedRole);
}
