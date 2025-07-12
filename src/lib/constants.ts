// src/lib/constants.ts
import { Home, Scale, FileText, Mic, Paperclip, NotebookPen, CreditCard, LayoutDashboard, HelpCircle, Bot, ListChecks, FileScan, CalendarClock, LibrarySquare, Gavel, Library, Route, ClipboardList, MessageSquareQuote, FileEdit, GraduationCap, Users, FileSignature, type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
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
    title: "Custom Motion Builder",
    href: "/custom-motion-builder",
    icon: FileEdit,
  },
   {
    title: "Communication Coach",
    href: "/courtroom-communication-coach",
    icon: MessageSquareQuote,
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
    title: "Violations Registry",
    href: "/violations-registry",
    icon: FileSignature,
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
    title: "Negotiation Coach",
    href: "/negotiation-coach",
    icon: Users,
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
    title: "Law School in a Box",
    href: "/law-school-in-a-box",
    icon: GraduationCap,
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
