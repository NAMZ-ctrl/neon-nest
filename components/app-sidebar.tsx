"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChartNoAxesCombined,
  WalletCards,
  Settings2,
  TargetIcon,
  LucideIcon,
} from "lucide-react";

export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
};

export const navData: NavItem[] = [
  // Dashboards Section
  { label: "Dashboards", isSection: true },
  { title: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Income", icon: ArrowDownToLine, href: "/income" },
  { title: "Expenses", icon: ArrowUpFromLine, href: "/expenses" },
  { title: "Budget", icon: ChartNoAxesCombined, href: "/budget" },
  { title: "Saving Goals", icon: TargetIcon, href: "/savings-goals" },

  // Manage Section
  { label: "Manage", isSection: true },
  { title: "Financial Accounts", icon: WalletCards, href: "/financial-accounts" },

  // User Section
  { label: "User", isSection: true },
  { title: "Settings", icon: Settings2, href: "/settings" },
];

// Group the flat array into { label, items[] } chunks, split on isSection markers
function groupNavData(items: NavItem[]) {
  const groups: { label: string; items: NavItem[] }[] = [];

  for (const item of items) {
    if (item.isSection && item.label) {
      groups.push({ label: item.label, items: [] });
      continue;
    }
    groups[groups.length - 1]?.items.push(item);
  }

  return groups;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const groups = React.useMemo(() => groupNavData(navData), []);

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader className="flex items-center px-4 py-3">
        <Image src="/neon.jpeg" width={20} height={20} alt="Neon Nest logo" />
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  if (!item.title || !item.href || !item.icon) return null;

                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className="transition-colors duration-200 ease-out"
                        render={<Link href={item.href} />}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}