import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";
import { SafeFoodRole, portalHref } from "@/lib/safefood-demo";

interface CitizenHeaderProps {
  activeSection: string;
  totalScansCount: number;
  complaintsCount: number;
  userProfile: any;
  userInitials: string;
  switchRole?: (role: SafeFoodRole) => void;
}

export function CitizenHeader({
  activeSection,
  totalScansCount,
  complaintsCount,
  userProfile,
  userInitials,
}: CitizenHeaderProps) {
  return (
    <header className="sf-web-header">
      <div className="sf-web-header-inner">
        {/* Left Navigation */}
        <nav className="sf-web-nav-links" aria-label="Primary Navigation">
          <Link
            to={portalHref("user", "dashboard")}
            className={`sf-web-nav-link ${
              activeSection === "dashboard" ? "sf-web-nav-link-active" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to={portalHref("user", "scan")}
            className={`sf-web-nav-link sf-web-nav-link-scan ${
              activeSection === "scan" ? "sf-web-nav-link-active" : ""
            }`}
          >
            <span className="sf-nav-pulse-dot" />
            Live Scan
          </Link>
          <Link
            to={portalHref("user", "history")}
            className={`sf-web-nav-link ${
              activeSection === "history" ? "sf-web-nav-link-active" : ""
            }`}
          >
            <span>Scan History</span>
            <span className="sf-nav-count-badge">{totalScansCount}</span>
          </Link>
          <Link
            to={portalHref("user", "complaints")}
            className={`sf-web-nav-link ${
              activeSection.startsWith("complaints")
                ? "sf-web-nav-link-active"
                : ""
            }`}
          >
            <span>Grievances</span>
            <span className={`sf-nav-count-badge ${complaintsCount > 0 ? "sf-nav-count-badge-alert" : ""}`}>
              {complaintsCount}
            </span>
          </Link>
        </nav>

        {/* Center Brand */}
        <Link
          to="/app/user/dashboard"
          className="sf-web-brand"
          aria-label="SafeFood Home"
        >
          <div className="sf-web-seal">
            <ShieldCheck />
          </div>
          <div className="sf-web-brand-text">
            <span className="sf-web-brand-title">SafeFood</span>
            <span className="sf-web-brand-subtitle">Consumer Portal</span>
          </div>
        </Link>

        {/* Right User Controls */}
        <div className="sf-web-header-right">
          <Link
            to={portalHref("user", "settings")}
            className="sf-web-user-chip"
            style={{ textDecoration: "none" }}
            title="View Account Profile & Settings"
          >
            <div className="sf-web-user-avatar">{userInitials}</div>
            <div className="sf-web-user-meta">
              <strong>{userProfile?.name || "Citizen Account"}</strong>
              <span>{userProfile?.district || "Maharashtra"}, MH</span>
            </div>
          </Link>

          <Link to="/login" className="sf-web-signout-btn" title="Sign out" aria-label="Sign out">
            <LogOut style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </div>
    </header>
  );
}
