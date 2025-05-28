// src/components/layout/app-shell.tsx
"use client";

import type React from "react";
import { Scale } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { PageHeader } from "./page-header";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const currentNavItem = NAV_ITEMS.find((item) => item.href === pathname);
  const pageTitle = currentNavItem ? currentNavItem.title : "Dashboard";

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Scale className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
              DUE PROCESS AI
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-sidebar-foreground/70">
            © {new Date().getFullYear()} DUE PROCESS AI
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b md:px-6">
          <PageHeader title={pageTitle} />
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
