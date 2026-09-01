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
