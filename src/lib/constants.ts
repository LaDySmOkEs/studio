
// src/lib/constants.ts
import { Scale, FileText, Mic, Paperclip, NotebookPen, CreditCard, LayoutDashboard, HelpCircle, Bot, ListChecks, FileScan, CalendarClock, LibrarySquare, Gavel, Library, Route, ClipboardList, type LucideIcon } from "lucide-react";

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
    title: "Procedural Roadmap",
    href: "/procedural-roadmap",
    icon: Route,
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
    title: "Legal Library",
    href: "/legal-library",
    icon: Library,
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
    title: "Court Filing Tracker",
    href: "/filing-tracker",
    icon: ClipboardList,
  },
  {
    title: "Mock Trial Simulator",
    href: "/mock-trial",
    icon: Gavel,
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
