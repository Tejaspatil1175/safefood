import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Search,
  Upload,
  Download,
  Bell,
  LogOut,
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  User,
  Settings as SettingsIcon,
} from "lucide-react";
import { SafeFoodRole, portalHref } from "@/lib/safefood-demo";
import {
  healthApi,
  scansApi,
  complaintsApi,
  districtsApi,
} from "@/lib/api";
import { AdminDashboardView } from "./AdminDashboardView";
import {
  AdminProductsView,
  AdminComplaintsView,
  AdminOfficersView,
  AdminUsersView,
} from "./AdminSubviews";

interface AdminWebViewProps {
  activeSection: string;
  switchRole: (r: SafeFoodRole) => void;
  newOfficerName: string;
  setNewOfficerName: (v: string) => void;
  newOfficerDistrict: string;
  setNewOfficerDistrict: (v: string) => void;
  officerAddedMessage: boolean;
  setOfficerAddedMessage: (v: boolean) => void;
}

export function AdminWebView({
  activeSection,
  switchRole,
  newOfficerName,
  setNewOfficerName,
  newOfficerDistrict,
  setNewOfficerDistrict,
  officerAddedMessage,
  setOfficerAddedMessage,
}: AdminWebViewProps) {
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Monthly");
  const [systemHealth, setSystemHealth] = useState<{ status: string; uptime: number; timestamp?: string } | null>(null);
  const [districtOverview, setDistrictOverview] = useState<any>(null);
  const [officersFleet, setOfficersFleet] = useState<any[]>([
    { id: "#OFF-901", name: "Insp. Rajesh Patil", district: "Dhule Urban", activeCases: 14, status: "Active On-Duty" },
    { id: "#OFF-902", name: "Insp. Sneha Deshmukh", district: "Pune Central", activeCases: 9, status: "Active On-Duty" },
    { id: "#OFF-903", name: "Insp. Amit Kulkarni", district: "Mumbai Metro", activeCases: 22, status: "In Transit" },
  ]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [liveScansList, setLiveScansList] = useState<any[]>([]);
  const [citizensList, setCitizensList] = useState<any[]>([]);

  useEffect(() => {
    // 1. Health API (GET /api/v1/health)
    healthApi.check().then((h) => setSystemHealth(h)).catch((e) => console.warn("Health check notice:", e));

    // 2. Districts Overview (GET /api/v1/districts/overview)
    districtsApi.getOverview().then((ov) => setDistrictOverview(ov)).catch((e) => console.warn("District overview notice:", e));

    // 3. Officers fleet (GET /api/v1/districts/officers)
    districtsApi.listOfficers().then((ofs: any) => {
      const officersArray = Array.isArray(ofs) ? ofs : ofs?.officers || [];
      if (officersArray.length > 0) {
        const mapped = officersArray.map((o: any) => ({
          id: `#OFF-${o.badgeNumber || o.id?.slice(-3) || o._id?.slice(-3) || "904"}`,
          name: o.name || "Enforcement Officer",
          district: o.district || "Maharashtra",
          activeCases: o.activeCases ?? 0,
          status: o.isActive !== false ? "Active On-Duty" : "Standby",
        }));
        setOfficersFleet((prev) => [...mapped, ...prev.filter(p => !mapped.some((m: any) => m.name === p.name))]);
      }
    }).catch((e) => console.warn("Officers list notice:", e));

    // 4. District Reports / Grievances (GET /api/v1/districts/reports)
    districtsApi.listReports().then((reps: any) => {
      const items = Array.isArray(reps) ? reps : reps?.complaints || reps?.items || [];
      if (items.length > 0) {
        setReportsList(items);
      }
    }).catch((e) => console.warn("Reports list notice:", e));

    complaintsApi.list().then((res: any) => {
      const items = Array.isArray(res) ? res : res?.items || res?.complaints || [];
      if (items.length > 0) {
        setReportsList(items);
      }
    }).catch(() => {});

    // 5. Live Audited Food Products (GET /api/v1/scans)
    scansApi.list({ limit: 50 }).then((res: any) => {
      const items = Array.isArray(res) ? res : res?.items || res?.scans || [];
      if (items.length > 0) {
        setLiveScansList(items);
      }
    }).catch(() => {});

    // 6. Citizen Users Directory (GET /api/v1/districts/users)
    districtsApi.listUsers().then((res: any) => {
      const users = res?.users || (Array.isArray(res) ? res : []);
      if (users.length > 0) {
        setCitizensList(users);
      }
    }).catch((e) => console.warn("Users list notice:", e));
  }, []);

  const handleDeployOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName) return;
    try {
      await districtsApi.createOfficer({
        name: newOfficerName,
        email: `${newOfficerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@safefood.in`,
        district: newOfficerDistrict,
        badgeNumber: `OFF-${Math.floor(100 + Math.random() * 900)}`,
      });
      setOfficersFleet((prev) => [
        {
          id: `#OFF-${Math.floor(100 + Math.random() * 900)}`,
          name: newOfficerName,
          district: newOfficerDistrict,
          activeCases: 0,
          status: "Active On-Duty",
        },
        ...prev,
      ]);
    } catch (err) {
      console.warn("Deploy officer API notice:", err);
    }
    setOfficerAddedMessage(true);
    setNewOfficerName("");
  };

  return (
    <div className="sf-admin-layout">
      {/* 1. LEFT SIDEBAR NAVBAR */}
      <aside className="sf-admin-sidebar">
        <div className="sf-admin-sidebar-header">
          <a href="/app/admin/dashboard" className="sf-admin-brand">
            <div className="sf-admin-brand-icon">
              <ShieldCheck style={{ width: 19, height: 19 }} />
            </div>
            <span>SafeFood</span>
            <span className="sf-admin-brand-badge">Admin</span>
          </a>
        </div>

        {/* Vertical Navigation Links */}
        <nav className="sf-admin-sidebar-nav" aria-label="Admin Sidebar Navigation">
          <a
            href={portalHref("admin", "dashboard")}
            className={`sf-admin-sidebar-link ${activeSection === "dashboard" ? "sf-admin-sidebar-link-active" : ""}`}
          >
            <LayoutDashboard style={{ width: 17, height: 17 }} />
            <span>Dashboard</span>
          </a>
          <a
            href={portalHref("admin", "products")}
            className={`sf-admin-sidebar-link ${activeSection === "products" ? "sf-admin-sidebar-link-active" : ""}`}
          >
            <Package style={{ width: 17, height: 17 }} />
            <span>Food Catalog</span>
          </a>
          <a
            href={portalHref("admin", "complaints")}
            className={`sf-admin-sidebar-link ${activeSection === "complaints" ? "sf-admin-sidebar-link-active" : ""}`}
          >
            <ClipboardList style={{ width: 17, height: 17 }} />
            <span>Grievances</span>
          </a>
          <a
            href={portalHref("admin", "officers")}
            className={`sf-admin-sidebar-link ${activeSection === "officers" ? "sf-admin-sidebar-link-active" : ""}`}
          >
            <Users style={{ width: 17, height: 17 }} />
            <span>Officers Fleet</span>
          </a>
          <a
            href={portalHref("admin", "users")}
            className={`sf-admin-sidebar-link ${activeSection === "users" ? "sf-admin-sidebar-link-active" : ""}`}
          >
            <User style={{ width: 17, height: 17 }} />
            <span>Citizens</span>
          </a>
          <a
            href={portalHref("admin", "settings")}
            className={`sf-admin-sidebar-link ${activeSection === "settings" ? "sf-admin-sidebar-link-active" : ""}`}
          >
            <SettingsIcon style={{ width: 17, height: 17 }} />
            <span>Settings</span>
          </a>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="sf-admin-sidebar-footer">
          <select
            className="sf-admin-role-select"
            value="admin"
            onChange={(e) => switchRole(e.target.value as SafeFoodRole)}
            aria-label="Switch persona"
            style={{ width: "100%" }}
          >
            <option value="user">🌿 Citizen View</option>
            <option value="officer">🛡️ Officer Inspection</option>
            <option value="admin">🏢 Regulatory Admin</option>
          </select>

          {/* User Profile Capsule */}
          <div className="sf-admin-user-profile" title="Signed in as State Director" style={{ width: "100%", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div className="sf-admin-user-avatar">SK</div>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.2 }}>
                <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 12 }}>Dr. S. Kulkarni</span>
                <span style={{ fontSize: 10, color: "#64748B" }}>State Director</span>
              </div>
            </div>
            <a href="/login" style={{ color: "#64748B", display: "grid", placeItems: "center" }} title="Sign out">
              <LogOut style={{ width: 14, height: 14 }} />
            </a>
          </div>
        </div>
      </aside>

      {/* 2. MAIN ADMIN CONTENT WRAPPER */}
      <div className="sf-admin-main-wrap">
        {/* TOPBAR / SUBHEAD */}
        <div className="sf-admin-topbar">
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F172A" }}>
              {activeSection === "dashboard" && "Food Safety & Metrology Dashboard"}
              {activeSection === "products" && "Packaged Food Catalog & Barcode Registry"}
              {activeSection === "complaints" && "Citizen Grievances & Violation Notices"}
              {activeSection === "officers" && "Officer Fleet & Field Oversight"}
              {activeSection === "users" && "Citizen Consumer Directory"}
              {activeSection === "settings" && "Regulatory Standards & Declarations Config"}
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>
              National Legal Metrology & FSSAI Packaged Commodity Enforcement Console
            </p>
          </div>

          <div className="sf-admin-subhead-actions">
            {/* Live Backend Health Badge (GET /api/v1/health) */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 16, background: systemHealth ? "#DCFCE7" : "#F1F5F9", color: systemHealth ? "#15803D" : "#475569", fontSize: 11, fontWeight: 700 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: systemHealth ? "#22C55E" : "#94A3B8" }} />
              {systemHealth ? "Backend API Live" : "Connecting..."}
            </div>

            <div className="sf-admin-search-box">
              <Search style={{ width: 15, height: 15 }} />
              <input
                type="text"
                placeholder="Search food item, barcode, packer..."
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="sf-admin-btn-outline"
              onClick={() => alert("Exporting Legal Metrology audit CSV dataset...")}
            >
              <Upload style={{ width: 14, height: 14 }} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="sf-admin-btn-outline"
              onClick={() => alert("Downloading Statewide Food Safety Compliance Report (PDF)...")}
            >
              <Download style={{ width: 14, height: 14 }} />
              <span>Download Report</span>
            </button>

            <button
              type="button"
              className="sf-admin-notif-btn"
              title="Recent regulatory alerts"
              onClick={() => alert("3 new Legal Metrology compliance notices pending verification.")}
            >
              <Bell style={{ width: 16, height: 16 }} />
              <span className="sf-admin-notif-dot" />
            </button>
          </div>
        </div>

        {/* 3. MAIN CANVAS */}
        <main style={{ padding: "28px 32px 48px", maxWidth: 1600 }}>
          {activeSection === "dashboard" && (
            <AdminDashboardView
              liveScansList={liveScansList}
              reportsList={reportsList}
              districtOverview={districtOverview}
              selectedTimeframe={selectedTimeframe}
              setSelectedTimeframe={setSelectedTimeframe}
            />
          )}

          {activeSection === "products" && (
            <AdminProductsView liveScansList={liveScansList} />
          )}

          {activeSection === "complaints" && (
            <AdminComplaintsView reportsList={reportsList} />
          )}

          {activeSection === "officers" && (
            <AdminOfficersView
              officersFleet={officersFleet}
              newOfficerName={newOfficerName}
              setNewOfficerName={setNewOfficerName}
              newOfficerDistrict={newOfficerDistrict}
              setNewOfficerDistrict={setNewOfficerDistrict}
              officerAddedMessage={officerAddedMessage}
              handleDeployOfficer={handleDeployOfficer}
            />
          )}

          {activeSection === "users" && (
            <AdminUsersView citizensList={citizensList} />
          )}

          {(activeSection === "analytics" || activeSection === "settings") && (
            <div className="sf-admin-card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F1F5F9", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                <SettingsIcon style={{ width: 24, height: 24, color: "#0F172A" }} />
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>
                {activeSection === "analytics" ? "Statewide Analytical Intelligence" : "Regulatory System Configuration"}
              </h3>
              <p style={{ color: "#64748B", maxWidth: 500, margin: "0 auto 20px", fontSize: 13 }}>
                Full operational parameters, automated legal metrology audit rules, and compliance thresholds are configured and operating in real-time.
              </p>
              <a href={portalHref("admin", "dashboard")} className="sf-admin-btn-outline">
                Return to Dashboard
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
