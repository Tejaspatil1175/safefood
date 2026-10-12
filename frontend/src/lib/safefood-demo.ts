import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileClock,
  FilePlus2,
  FileSearch,
  FileText,
  History,
  Home,
  Leaf,
  ListChecks,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export type SafeFoodRole = "user" | "officer" | "admin";

export type PortalNavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export type PortalRole = {
  name: string;
  title: string;
  email: string;
  initials: string;
  basePath: string;
  navigation: PortalNavItem[];
};

const roleSetup: Record<SafeFoodRole, Omit<PortalRole, "navigation">> = {
  user: {
    name: "Aarav Sharma",
    title: "Citizen account",
    email: "user@test.com",
    initials: "AS",
    basePath: "/app/user",
  },
  officer: {
    name: "Inspector Meera Iyer",
    title: "Enforcement officer",
    email: "officer@test.com",
    initials: "MI",
    basePath: "/app/officer",
  },
  admin: {
    name: "Platform Administrator",
    title: "System administrator",
    email: "admin@test.com",
    initials: "PA",
    basePath: "/app/admin",
  },
};

const navigation: Record<SafeFoodRole, PortalNavItem[]> = {
  user: [
    { label: "Dashboard", path: "dashboard", icon: Home },
    { label: "Scan a label", path: "scan", icon: ScanLine },
    { label: "My history", path: "history", icon: History },
    { label: "My complaints", path: "complaints", icon: FileText },
    { label: "File a grievance", path: "complaints/new", icon: FilePlus2 },
    { label: "Settings", path: "settings", icon: Settings },
  ],
  officer: [
    { label: "Dashboard", path: "dashboard", icon: Home },
    { label: "Inspect a label", path: "scan", icon: ScanLine },
    { label: "Inspection history", path: "history", icon: FileClock },
    { label: "Investigations", path: "investigations", icon: ClipboardCheck },
    { label: "Officer settings", path: "settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", path: "dashboard", icon: Home },
    { label: "Citizens", path: "users", icon: Users },
    { label: "Officer fleet", path: "officers", icon: UserCog },
    { label: "All grievances", path: "complaints", icon: FileText },
    { label: "Platform settings", path: "settings", icon: Settings },
  ],
};

export const portalRoles: Record<SafeFoodRole, PortalRole> = {
  user: { ...roleSetup.user, navigation: navigation.user },
  officer: { ...roleSetup.officer, navigation: navigation.officer },
  admin: { ...roleSetup.admin, navigation: navigation.admin },
};

export function parsePortalLocation(splat: string | undefined) {
  const segments = (splat ?? "").split("/").filter(Boolean);
  const requestedRole = segments[0];
  const role: SafeFoodRole = requestedRole === "officer" || requestedRole === "admin" ? requestedRole : "user";
  const rest = segments.slice(1);
  const activeSection = rest[0] ?? "dashboard";

  return {
    role,
    segments: rest,
    activeSection,
    requestedPath: segments.join("/") || `${role}/dashboard`,
    isReport: activeSection === "report",
    isInvestigationDetail: role === "officer" && activeSection === "investigations" && rest.length > 1,
    isComplaintCreate: activeSection === "complaints" && rest[1] === "new",
    isComplaintDetail: activeSection === "complaints" && rest.length > 1 && rest[1] !== "new",
  };
}

export function portalHref(role: SafeFoodRole, path: string) {
  return `${portalRoles[role].basePath}/${path}`;
}

export function roleForDemoEmail(email: string): SafeFoodRole {
  if (email.trim().toLowerCase() === "officer@test.com") return "officer";
  if (email.trim().toLowerCase() === "admin@test.com") return "admin";
  return "user";
}

export const sampleScans = [
  { id: "SF-20841", product: "Almond Oat Energy Bar", category: "Packaged snack", date: "Today, 10:42 am", result: "Check label", warning: true },
  { id: "SF-20835", product: "Farm Fresh Toned Milk", category: "Dairy", date: "Yesterday, 6:15 pm", result: "Looks good", warning: false },
  { id: "SF-20819", product: "Golden Harvest Basmati Rice", category: "Staple", date: "Oct 10, 2:06 pm", result: "Looks good", warning: false },
  { id: "SF-20798", product: "Crispy Masala Chips", category: "Packaged snack", date: "Oct 9, 11:21 am", result: "Check label", warning: true },
];

export const sampleComplaints = [
  { id: "GRV-2048", product: "Almond Oat Energy Bar", location: "Indiranagar Market, Bengaluru", date: "Oct 11, 2026", status: "Under investigation", officer: "Meera Iyer" },
  { id: "GRV-2042", product: "Crispy Masala Chips", location: "Koramangala, Bengaluru", date: "Oct 8, 2026", status: "Submitted", officer: "Not assigned" },
  { id: "GRV-2016", product: "Packaged fruit juice", location: "MG Road, Bengaluru", date: "Oct 2, 2026", status: "Resolved", officer: "Rajiv Nair" },
];

export const sampleInvestigations = [
  { id: "INV-873", complaint: "GRV-2048", product: "Almond Oat Energy Bar", district: "Bengaluru Urban", assigned: "Today, 9:14 am", status: "Assigned" },
  { id: "INV-869", complaint: "GRV-2039", product: "Packaged fruit drink", district: "Bengaluru Urban", assigned: "Yesterday, 4:02 pm", status: "Under investigation" },
  { id: "INV-851", complaint: "GRV-1995", product: "Instant noodle pack", district: "Bengaluru Urban", assigned: "Oct 9, 2026", status: "Completed" },
];

export const mandatoryDeclarations = [
  { label: "Maximum retail price (MRP)", ok: true, detail: "₹45.00 inclusive of taxes" },
  { label: "Net quantity", ok: true, detail: "40 g" },
  { label: "Best before date", ok: true, detail: "12 months from packaging" },
  { label: "Manufacturer / packer details", ok: false, detail: "Address may be incomplete" },
  { label: "Customer care contact", ok: true, detail: "Phone number present" },
  { label: "FSSAI license number", ok: true, detail: "License number printed" },
];

export const dashboardIcons = {
  activity: Activity,
  alert: AlertTriangle,
  chart: BarChart3,
  bell: Bell,
  building: Building2,
  check: CheckCircle2,
  leaf: Leaf,
  list: ListChecks,
  search: Search,
  shield: ShieldCheck,
  scan: ScanLine,
  fileSearch: FileSearch,
};