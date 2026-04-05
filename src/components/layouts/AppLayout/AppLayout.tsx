"use client";

import type { BottomNavItem, BreadcrumbItem, SidebarItem } from "@pliq/ui";
import {
  Badge,
  BottomNav,
  Breadcrumb,
  Navbar,
  Sidebar,
  useMediaQuery,
} from "@pliq/ui";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import type { AppLayoutProps } from "./AppLayout.model";
import styles from "./AppLayoutStyles.module.css";

const DESKTOP_QUERY = "(min-width: 62em)";

function getNavItems(role: string | undefined): SidebarItem[] {
  const tenantItems: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Search", href: "/search" },
    { label: "Applications", href: "/applications" },
    { label: "Leases", href: "/leases" },
    { label: "Payments", href: "/payments" },
    { label: "Reputation", href: "/reputation" },
  ];

  const landlordItems: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Properties", href: "/properties" },
    { label: "Applications", href: "/applications" },
    { label: "Leases", href: "/leases" },
    { label: "Payments", href: "/payments" },
  ];

  const common: SidebarItem[] = [
    { label: "Messages", href: "/messages" },
    { label: "Notifications", href: "/notifications" },
    { label: "Settings", href: "/settings" },
  ];

  if (role === "landlord") return [...landlordItems, ...common];
  if (role === "both")
    return [
      ...tenantItems,
      { label: "Properties", href: "/properties" },
      ...common,
    ];
  return [...tenantItems, ...common];
}

function getMobileNavItems(pathname: string): BottomNavItem[] {
  return [
    {
      label: "Home",
      icon: <span aria-hidden="true">H</span>,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      label: "Search",
      icon: <span aria-hidden="true">S</span>,
      href: "/search",
      isActive: pathname.startsWith("/search"),
    },
    {
      label: "Leases",
      icon: <span aria-hidden="true">L</span>,
      href: "/leases",
      isActive: pathname.startsWith("/leases"),
    },
    {
      label: "Messages",
      icon: <span aria-hidden="true">M</span>,
      href: "/messages",
      isActive: pathname.startsWith("/messages"),
    },
    {
      label: "Profile",
      icon: <span aria-hidden="true">P</span>,
      href: "/settings",
      isActive: pathname === "/settings",
    },
  ];
}

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, i) => ({
    label:
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
    href:
      i < segments.length - 1
        ? `/${segments.slice(0, i + 1).join("/")}`
        : undefined,
  }));
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  const sidebarItems = getNavItems(profile?.role);
  const mobileItems = getMobileNavItems(pathname);
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <div className={styles.layout}>
      <Navbar
        logo={<span className={styles.logo}>Pliq</span>}
        items={[]}
        actions={
          <a
            href="/notifications"
            className={styles.notifAction}
            aria-label={`${unreadCount} unread notifications`}
          >
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="error" size="sm">
                {unreadCount}
              </Badge>
            )}
          </a>
        }
      />
      <div className={styles.body}>
        {isDesktop && (
          <Sidebar
            items={sidebarItems}
            isCollapsed={sidebarCollapsed}
            onCollapse={() => setSidebarCollapsed((c) => !c)}
          />
        )}
        <main className={styles.main}>
          {breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} className={styles.breadcrumb} />
          )}
          <div className={styles.content}>{children}</div>
        </main>
      </div>
      {!isDesktop && <BottomNav items={mobileItems} />}
    </div>
  );
}
