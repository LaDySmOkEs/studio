// src/lib/constants.ts
import { 
  Home, Scale, FileText, Mic, Paperclip, NotebookPen, CreditCard, 
  LayoutDashboard, HelpCircle, Bot, ListChecks, FileScan, CalendarClock, 
  LibrarySquare, Gavel, Library, Route, ClipboardList, MessageSquareQuote, 
  FileEdit, GraduationCap, Users, FileSignature, type LucideIcon, 
  Search, DraftingCompass, ShieldQuestion, Briefcase, Settings, CheckCircle, XCircle 
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  hidden?: boolean; // Add hidden property
}

export interface NavItemGroup {
  title: string;
  icon: LucideIcon;
  items: NavItem[];
}

export const NAV_ITEM_GROUPS: NavItemGroup[] = [
  {
    title: "Start Here",
    icon: Home,
    items: [
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
    ]
  },
  {
    title: "Investigative Tools",
    icon: Search,
    items: [
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
        title: "Violations Registry",
        href: "/violations-registry",
        icon: FileSignature,
      },
      {
        title: "Document Analyzer",
        href: "/document-analyzer",
        icon: FileScan,
      },
    ]
  },
  {
    title: "Legal Actions & Drafting",
    icon: DraftingCompass,
    items: [
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
        title: "Filing Assistant",
        href: "/filing-assistant",
        icon: LibrarySquare,
      },
      {
        title: "Court Filing Tracker",
        href: "/filing-tracker",
        icon: ClipboardList,
      },
    ]
  },
  {
    title: "Skills & Preparation",
    icon: Gavel,
    items: [
      {
        title: "Communication Coach",
        href: "/courtroom-communication-coach",
        icon: MessageSquareQuote,
      },
      {
        title: "Negotiation Coach",
        href: "/negotiation-coach",
        icon: Users,
      },
      {
        title: "Mock Trial Simulator",
        href: "/mock-trial",
        icon: Gavel,
      },
    ]
  },
  {
    title: "Personal & Secure Logs",
    icon: ShieldQuestion,
    items: [
      {
        title: "Rights Recorder",
        href: "/rights-recorder",
        icon: Mic,
      },
      {
        title: "Trauma Log",
        href: "/trauma-log",
        icon: NotebookPen,
      },
    ]
  },
  {
    title: "Learning & Reference",
    icon: Library,
    items: [
      {
        title: "Interactive Assistant",
        href: "/interactive-assistant",
        icon: Bot,
      },
      {
        title: "Legal Library",
        href: "/legal-library",
        icon: Library,
      },
      {
        title: "Law School in a Box",
        href: "/law-school-in-a-box",
        icon: GraduationCap,
      },
      {
        title: "Due Process Checklist",
        href: "/due-process-checklist",
        icon: ListChecks,
      },
    ]
  },
  {
    title: "Account & Help",
    icon: Settings,
    items: [
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
      // Hidden routes for payment flow
      {
        title: "Payment Success",
        href: "/subscription/success",
        icon: CheckCircle,
        hidden: true,
      },
      {
        title: "Payment Canceled",
        href: "/subscription/cancel",
        icon: XCircle,
        hidden: true,
      }
    ]
  }
];

// Flat list for simpler access elsewhere in the app if needed, filtering out hidden items
export const NAV_ITEMS: NavItem[] = NAV_ITEM_GROUPS.flatMap(group => group.items.filter(item => !item.hidden));
