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
  switchRole: (role: SafeFoodRole) => void;
}

export function CitizenHeader({
  activeSection,
  totalScansCount,
  complaintsCount,
  userProfile,
  userInitials,
  switchRole,
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
            className={`sf-web-nav-link ${
              activeSection === "scan" ? "sf-web-nav-link-active" : ""
            }`}
          >
            Live Scan
          </Link>
          <Link
            to={portalHref("user", "history")}
            className={`sf-web-nav-link ${
              activeSection === "history" ? "sf-web-nav-link-active" : ""
            }`}
          >
            Scan History ({totalScansCount})
          </Link>
          <Link
            to={portalHref("user", "complaints")}
            className={`sf-web-nav-link ${
              activeSection.startsWith("complaints")
                ? "sf-web-nav-link-active"
                : ""
            }`}
          >
            Grievances ({complaintsCount})
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

        {/* Right Navigation & User Controls */}
        <div className="sf-web-header-right">
          <nav className="sf-web-nav-links" aria-label="Right Navigation">
            <Link
              to={portalHref("user", "settings")}
              className={`sf-web-nav-link ${
                activeSection === "settings" ? "sf-web-nav-link-active" : ""
              }`}
            >
              Profile
            </Link>
          </nav>

          <select
            className="sf-web-role-picker"
            value="user"
            onChange={(e) => switchRole(e.target.value as SafeFoodRole)}
            aria-label="Switch persona"
          >
            <option value="user">🌿 Citizen View</option>
            <option value="officer">🛡️ Officer Inspection</option>
            <option value="admin">🏢 Regulatory Oversight</option>
          </select>

          <div className="sf-web-user-chip">
            <div className="sf-web-user-avatar">{userInitials}</div>
            <div className="sf-web-user-meta">
              <strong>{userProfile?.name || "Citizen Account"}</strong>
              <span>{userProfile?.district || "Maharashtra"}, MH</span>
            </div>
          </div>

          <Link to="/login" className="sf-web-signout-btn" title="Sign out">
            <LogOut style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </div>
    </header>
  );
}
