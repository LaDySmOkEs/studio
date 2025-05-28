
// src/lib/constants.ts
import { Scale, FileText, Mic, Building2, Paperclip, NotebookPen, CreditCard, LayoutDashboard, HelpCircle, Bot, ListChecks, FileScan, CalendarClock, LifeBuoy, LibrarySquare, type LucideIcon } from "lucide-react";

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
    title: "Interactive Assistant",
    href: "/interactive-assistant",
    icon: Bot,
  },
  {
    title: "Document Analyzer",
    href: "/document-analyzer",
    icon: FileScan,
  },
  {
    title: "Timeline & Event Log",
    href: "/timeline-event-log",
    icon: CalendarClock,
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
    title: "Due Process Checklist",
    href: "/due-process-checklist",
    icon: ListChecks,
  },
  {
    title: "Filing Assistant",
    href: "/filing-assistant",
    icon: LibrarySquare,
  },
  {
    title: "Legal Aid Referral",
    href: "/legal-aid-referral",
    icon: LifeBuoy,
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
  {
    title: "Help / FAQ",
    href: "/help-faq",
    icon: HelpCircle,
  },
];

