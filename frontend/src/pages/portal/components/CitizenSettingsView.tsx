import React from "react";
import { LogOut } from "lucide-react";

interface CitizenSettingsViewProps {
  userProfile: any;
}

export function CitizenSettingsView({ userProfile }: CitizenSettingsViewProps) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="sf-web-section-head">
        <div>
          <h3>Citizen Account Settings</h3>
          <p>Verified profile & Legal Metrology jurisdiction</p>
        </div>
      </div>

      <div className="sf-web-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="sf-demo-field">
          <label>Full Legal Name</label>
          <input type="text" readOnly value={userProfile?.name || "Citizen Account"} />
        </div>

        <div className="sf-demo-field">
          <label>Registered Email Address</label>
          <input type="text" readOnly value={userProfile?.email || "Loading..."} />
        </div>

        <div className="sf-demo-field">
          <label>District Jurisdiction</label>
          <input
            type="text"
            readOnly
            value={userProfile?.district ? `${userProfile.district} / MAHARASHTRA` : "DHULE / MAHARASHTRA"}
          />
        </div>

        <div className="sf-demo-field">
          <label>Account Role</label>
          <input
            type="text"
            readOnly
            value={userProfile?.role ? userProfile.role.toUpperCase() : "CITIZEN"}
          />
        </div>

        <div className="sf-demo-toggle-line">
          <div>
            <strong>Legal Metrology PCR 2011 Automated Alerts</strong>
            <div style={{ color: "#7A6F5D", fontSize: "11px" }}>
              Receive alerts when non-compliant products are recalled in your district.
            </div>
          </div>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="sf-demo-toggle-line">
          <div>
            <strong>Grievance Resolution Updates</strong>
            <div style={{ color: "#7A6F5D", fontSize: "11px" }}>
              Instant notification when a food safety officer reviews your complaint.
            </div>
          </div>
          <input type="checkbox" defaultChecked />
        </div>

        <a
          href="/login"
          className="sf-web-pill-secondary"
          style={{ alignSelf: "flex-start", color: "#B91C1C", borderColor: "#B91C1C", marginTop: 8 }}
        >
          <LogOut style={{ width: 15, height: 15 }} />
          Sign Out from SafeFood
        </a>
      </div>
    </div>
  );
}
