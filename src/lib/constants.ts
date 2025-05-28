// src/lib/constants.ts
import { Scale, FileText, Mic, Building2, Paperclip, NotebookPen, CreditCard, LayoutDashboard, type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Case Analysis",
    href: "/case-analysis",
    icon: Scale,
  },
  {
    title: "Document Generator",
    href: "/document-generator",
    icon: FileText,
  },
  {
    title: "Rights Recorder",
    href: "/rights-recorder",
    icon: Mic,
  },
  {
    title: "Court Directory",
    href: "/court-directory",
    icon: Building2,
  },
  {
    title: "Evidence Compiler",
    href: "/evidence-compiler",
    icon: Paperclip,
  },
  {
    title: "Trauma Log",
    href: "/trauma-log",
    icon: NotebookPen,
  },
  {
    title: "Subscription",
    href: "/subscription",
    icon: CreditCard,
  },
  {
    title: "Admin Dashboard",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
];
