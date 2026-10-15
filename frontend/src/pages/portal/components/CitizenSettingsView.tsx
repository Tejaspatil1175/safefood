import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  MapPin,
  Award,
  BellRing,
  FileCheck2,
  FileText,
  AlertTriangle,
  LogOut,
  Sparkles,
} from "lucide-react";

interface CitizenSettingsViewProps {
  userProfile: any;
  totalScansCount?: number;
  complaintsCount?: number;
  userInitials?: string;
}

export function CitizenSettingsView({
  userProfile,
  totalScansCount = 0,
  complaintsCount = 0,
  userInitials = "CA",
}: CitizenSettingsViewProps) {
  const [pcrAlerts, setPcrAlerts] = useState(true);
  const [grievanceAlerts, setGrievanceAlerts] = useState(true);
  const [statutoryUpdates, setStatutoryUpdates] = useState(false);

  const initials =
    userInitials ||
    (userProfile?.name
      ? userProfile.name
          .split(" ")
          .map((n: string) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "CA");

  return (
    <div className="sf-profile-container">
      {/* 1. Hero Identity Banner */}
      <div className="sf-profile-hero-card">
        <div className="sf-profile-hero-inner">
          <div className="sf-profile-avatar-group">
            <div className="sf-profile-avatar-large">
              {initials}
            </div>
            <div>
              <div className="sf-profile-hero-title-row">
                <h2 className="sf-profile-name">{userProfile?.name || "Citizen Account"}</h2>
                <span className="sf-profile-badge-pill">
                  <ShieldCheck style={{ width: 14, height: 14, color: "#C5A059" }} />
                  Verified Consumer
                </span>
              </div>
              <div className="sf-profile-meta-row">
                <span className="sf-profile-meta-item">
                  <Mail style={{ width: 14, height: 14, opacity: 0.7 }} />
                  {userProfile?.email || "citizen@safefood.gov.in"}
                </span>
                <span className="sf-profile-meta-item">
                  <MapPin style={{ width: 14, height: 14, opacity: 0.7 }} />
                  {userProfile?.district ? `${userProfile.district}, MH` : "Dhule, Maharashtra"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="sf-profile-hero-quickstats">
            <div className="sf-profile-quickstat">
              <span className="sf-profile-quickstat-num">{totalScansCount}</span>
              <span className="sf-profile-quickstat-lbl">Audits</span>
            </div>
            <div className="sf-profile-stat-sep" />
            <div className="sf-profile-quickstat">
              <span className="sf-profile-quickstat-num">{complaintsCount}</span>
              <span className="sf-profile-quickstat-lbl">Grievances</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Settings Grid (2 Columns on Desktop) */}
      <div className="sf-profile-grid">
        {/* Card 1: Statutory & Jurisdiction Credentials */}
        <div className="sf-settings-card">
          <div className="sf-settings-card-header">
            <div className="sf-settings-card-icon">
              <Award style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <h4 className="sf-settings-card-title">Metrology Jurisdiction</h4>
              <p className="sf-settings-card-desc">Enforcement authority & identity mapping</p>
            </div>
          </div>

          <div className="sf-data-list">
            <div className="sf-data-row">
              <span className="sf-data-row-label">Full Legal Name</span>
              <div className="sf-data-row-val">
                <span>{userProfile?.name || "Citizen Account"}</span>
                <span className="sf-data-row-tag">GovID Verified</span>
              </div>
            </div>

            <div className="sf-data-row">
              <span className="sf-data-row-label">Primary Email</span>
              <div className="sf-data-row-val">
                <span>{userProfile?.email || "citizen@safefood.gov.in"}</span>
              </div>
            </div>

            <div className="sf-data-row">
              <span className="sf-data-row-label">Legal District Jurisdiction</span>
              <div className="sf-data-row-val">
                <span>{userProfile?.district ? `${userProfile.district.toUpperCase()}, MAHARASHTRA` : "DHULE, MAHARASHTRA"}</span>
                <span className="sf-data-row-tag">Active Zone</span>
              </div>
            </div>

            <div className="sf-data-row">
              <span className="sf-data-row-label">Enforcement Framework</span>
              <div className="sf-data-row-val">
                <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Consumer Alerts & Notification Preferences */}
        <div className="sf-settings-card">
          <div className="sf-settings-card-header">
            <div className="sf-settings-card-icon">
              <BellRing style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <h4 className="sf-settings-card-title">Consumer Protection Alerts</h4>
              <p className="sf-settings-card-desc">Real-time alerts regarding statutory violations</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="sf-toggle-item">
              <div className="sf-toggle-info">
                <strong>Legal Metrology PCR 2011 Recalls</strong>
                <p>Instant alerts when non-compliant or deceptive packaging is red-flagged in your district.</p>
              </div>
              <label className="sf-switch">
                <input
                  type="checkbox"
                  checked={pcrAlerts}
                  onChange={(e) => setPcrAlerts(e.target.checked)}
                />
                <span className="sf-switch-slider" />
              </label>
            </div>

            <div className="sf-toggle-item">
              <div className="sf-toggle-info">
                <strong>Grievance Resolution Updates</strong>
                <p>Receive notifications when an authorized Food Safety Inspector reviews your submitted report.</p>
              </div>
              <label className="sf-switch">
                <input
                  type="checkbox"
                  checked={grievanceAlerts}
                  onChange={(e) => setGrievanceAlerts(e.target.checked)}
                />
                <span className="sf-switch-slider" />
              </label>
            </div>

            <div className="sf-toggle-item">
              <div className="sf-toggle-info">
                <strong>Statutory Rule & Threshold Changes</strong>
                <p>Quarterly digest regarding Legal Metrology amendments, MRP mandates, and labeling guidelines.</p>
              </div>
              <label className="sf-switch">
                <input
                  type="checkbox"
                  checked={statutoryUpdates}
                  onChange={(e) => setStatutoryUpdates(e.target.checked)}
                />
                <span className="sf-switch-slider" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Account Actions & Security Card */}
      <div className="sf-settings-card sf-danger-card">
        <div className="sf-danger-action-row">
          <div>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#201E1A" }}>
              Active Session & Authentication
            </h4>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7A6F5D" }}>
              Sign out from your verified consumer session on this device.
            </p>
          </div>

          <Link to="/login" className="sf-danger-btn">
            <LogOut style={{ width: 14, height: 14 }} />
            Sign Out of SafeFood
          </Link>
        </div>
      </div>
    </div>
  );
}
