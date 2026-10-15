import React from "react";
import { Link } from "react-router-dom";
import { Home, History, ScanLine, FileText, User } from "lucide-react";
import { portalHref, SafeFoodRole } from "@/lib/safefood-demo";

interface AppFloatingFooterProps {
  role: "user" | "officer";
  activeSection: string;
}

export function AppFloatingFooter({ role, activeSection }: AppFloatingFooterProps) {
  const isDashboard = activeSection === "dashboard";
  const isScan = activeSection === "scan";
  const isHistory = activeSection === "history";
  const isComplaints = activeSection.startsWith("complaints") || activeSection.startsWith("investigations");
  const isProfile = activeSection === "settings";

  const complaintsPath = role === "officer" ? "investigations" : "complaints";
  const complaintsLabel = role === "officer" ? "Cases" : "Grievances";

  return (
    <div className="sf-app-tabbar-wrap" aria-label="Mobile Navigation Bar">
      <nav className="sf-app-tabbar">
        {/* Tab 1: Home */}
        <Link
          to={portalHref(role, "dashboard")}
          className={`sf-app-tab-btn ${isDashboard ? "sf-app-tab-btn-active" : ""}`}
        >
          <Home size={20} strokeWidth={isDashboard ? 2.6 : 2} />
          <span>Home</span>
        </Link>

        {/* Tab 2: Scan Archive / History */}
        <Link
          to={portalHref(role, role === "officer" ? "dashboard" : "history")}
          className={`sf-app-tab-btn ${isHistory ? "sf-app-tab-btn-active" : ""}`}
        >
          <History size={20} strokeWidth={isHistory ? 2.6 : 2} />
          <span>History</span>
        </Link>

        {/* Center Elevated Action: Live Scanner */}
        <Link
          to={portalHref(role, "scan")}
          className="sf-app-center-scan-btn"
          title="Launch Live Barcode & Label Scanner"
          aria-label="Scan Food Product"
        >
          <ScanLine size={24} strokeWidth={2.4} />
        </Link>

        {/* Tab 4: Complaints / Officer Investigations */}
        <Link
          to={portalHref(role, complaintsPath)}
          className={`sf-app-tab-btn ${isComplaints ? "sf-app-tab-btn-active" : ""}`}
        >
          <FileText size={20} strokeWidth={isComplaints ? 2.6 : 2} />
          <span>{complaintsLabel}</span>
        </Link>

        {/* Tab 5: Profile / Settings */}
        <Link
          to={portalHref(role, "settings")}
          className={`sf-app-tab-btn ${isProfile ? "sf-app-tab-btn-active" : ""}`}
        >
          <User size={20} strokeWidth={isProfile ? 2.6 : 2} />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
