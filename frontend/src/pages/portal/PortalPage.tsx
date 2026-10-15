import "./Portal.css";
import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FilePlus2,
  ScanLine,
  History,
  Home,
  User,
  Users,
  UserCog,
  LogOut,
  ArrowRight,
  ClipboardCheck,
  Check,
  X,
  FileClock,
  Sparkles,
  Download,
  Building2,
  Plus,
  Camera,
  Bell,
  MapPin,
  ChevronRight,
  Eye,
  Phone,
  RefreshCw,
  Send,
  HelpCircle,
  Award,
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart3,
  Settings as SettingsIcon,
  Search,
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Store,
  Upload,
} from "lucide-react";
import {
  SafeFoodRole,
  portalRoles,
  parsePortalLocation,
  sampleScans,
  sampleComplaints,
  sampleInvestigations,
  mandatoryDeclarations,
  portalHref,
} from "@/lib/safefood-demo";
import { CitizenScanner } from "@/components/CitizenScanner";
import { CitizenWebView } from "./components/CitizenWebView";
import {
  healthApi,
  rulesApi,
  productsApi,
  authApi,
  scansApi,
  complaintsApi,
  officerApi,
  districtsApi,
  getStoredUser,
} from "@/lib/api";


import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function PortalPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const splatParam = params["*"] || location.pathname.replace(/^\/app\/?/, "");
  const locationInfo = parsePortalLocation(splatParam);
  const { role, activeSection, isInvestigationDetail, isComplaintCreate, isComplaintDetail } = locationInfo;

  // Interactive state
  const [selectedScanItem, setSelectedScanItem] = useState(sampleScans[0]!);
  const scanItem = selectedScanItem ?? sampleScans[0]!;
  const [newComplaintNote, setNewComplaintNote] = useState("");
  const [newComplaintDistrict, setNewComplaintDistrict] = useState("DHULE");
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [investigationStatus, setInvestigationStatus] = useState("under_investigation");
  const [officerNote, setOfficerNote] = useState("");
  const [officerActionSaved, setOfficerActionSaved] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState("");
  const [newOfficerDistrict, setNewOfficerDistrict] = useState("DHULE");
  const [officerAddedMessage, setOfficerAddedMessage] = useState(false);

  const switchRole = (newRole: SafeFoodRole) => {
    window.location.href = `/app/${newRole}/dashboard`;
  };

  if (role === "user") {
    return (
      <CitizenWebView
        activeSection={activeSection}
        isComplaintCreate={isComplaintCreate}
        isComplaintDetail={isComplaintDetail}
        complaintId={locationInfo.segments[1]}
        switchRole={switchRole}
      />
    );
  }

  if (role === "officer") {
    return (
      <OfficerWebView
        activeSection={activeSection}
        isInvestigationDetail={isInvestigationDetail}
        scanItem={scanItem}
        setSelectedScanItem={setSelectedScanItem}
        investigationStatus={investigationStatus}
        setInvestigationStatus={setInvestigationStatus}
        officerNote={officerNote}
        setOfficerNote={setOfficerNote}
        officerActionSaved={officerActionSaved}
        setOfficerActionSaved={setOfficerActionSaved}
        switchRole={switchRole}
      />
    );
  }

  return (
    <AdminWebView
      activeSection={activeSection}
      switchRole={switchRole}
      newOfficerName={newOfficerName}
      setNewOfficerName={setNewOfficerName}
      newOfficerDistrict={newOfficerDistrict}
      setNewOfficerDistrict={setNewOfficerDistrict}
      officerAddedMessage={officerAddedMessage}
      setOfficerAddedMessage={setOfficerAddedMessage}
    />
  );
}

/* ==========================================================================
   2. OFFICER WEB EXPERIENCE
   Warm organic cream background (#FAF5EA), editorial typography, book finish
   ========================================================================== */

type OfficerWebProps = {
  activeSection: string;
  isInvestigationDetail: boolean;
  scanItem: (typeof sampleScans)[number];
  setSelectedScanItem: (item: (typeof sampleScans)[number]) => void;
  investigationStatus: string;
  setInvestigationStatus: (v: string) => void;
  officerNote: string;
  setOfficerNote: (v: string) => void;
  officerActionSaved: boolean;
  setOfficerActionSaved: (v: boolean) => void;
  switchRole: (r: SafeFoodRole) => void;
};

function OfficerWebView({
  activeSection,
  isInvestigationDetail,
  scanItem,
  setSelectedScanItem,
  investigationStatus,
  setInvestigationStatus,
  officerNote,
  setOfficerNote,
  officerActionSaved,
  setOfficerActionSaved,
  switchRole,
}: OfficerWebProps) {
  const [officerStats, setOfficerStats] = useState({
    totalScans: 48,
    compliantProducts: 12,
    productsWithIssues: 16,
    pendingInvestigations: 5,
  });

  useEffect(() => {
    // Fetch live officer statistics (GET /api/v1/officer/stats)
    officerApi.getStats().then((data) => {
      if (data) {
        setOfficerStats({
          totalScans: data.totalScans || 48,
          compliantProducts: data.compliantProducts || 12,
          productsWithIssues: data.productsWithIssues || 16,
          pendingInvestigations: data.pendingInvestigations || 5,
        });
      }
    }).catch((err) => console.warn("Officer stats fetch notice:", err));
  }, []);

  return (
    <div className="sf-web-root">
      {/* Officer Header with Symmetric Layout */}
      <header className="sf-web-header">
        <div className="sf-web-header-inner">
          <nav className="sf-web-nav-links" aria-label="Officer Left Navigation">
            <a
              href={portalHref("officer", "dashboard")}
              className={`sf-web-nav-link ${activeSection === "dashboard" ? "sf-web-nav-link-active" : ""}`}
            >
              Inspection Feed
            </a>
            <a
              href={portalHref("officer", "scan")}
              className={`sf-web-nav-link ${activeSection === "scan" ? "sf-web-nav-link-active" : ""}`}
            >
              Field Audit Scan
            </a>
          </nav>

          <a href="/app/officer/dashboard" className="sf-web-brand" aria-label="SafeFood Officer">
            <div className="sf-web-seal" style={{ borderColor: "#2A5A48" }}>
              <ShieldCheck />
            </div>
            <div className="sf-web-brand-text">
              <span className="sf-web-brand-title">SafeFood Enforcement</span>
              <span className="sf-web-brand-subtitle">Dhule District Jurisdiction</span>
            </div>
          </a>

          <div className="sf-web-header-right">
            <nav className="sf-web-nav-links" aria-label="Officer Right Navigation">
              <a
                href={portalHref("officer", "investigations")}
                className={`sf-web-nav-link ${activeSection.startsWith("investigations") ? "sf-web-nav-link-active" : ""}`}
              >
                Assigned Cases
              </a>
              <a
                href={portalHref("officer", "settings")}
                className={`sf-web-nav-link ${activeSection === "settings" ? "sf-web-nav-link-active" : ""}`}
              >
                Profile
              </a>
            </nav>

            <select
              className="sf-web-role-picker"
              value="officer"
              onChange={(e) => switchRole(e.target.value as SafeFoodRole)}
              aria-label="Switch persona"
            >
              <option value="user">🌿 Citizen View</option>
              <option value="officer">🛡️ Officer Inspection</option>
              <option value="admin">🏢 Regulatory Oversight</option>
            </select>

            <div className="sf-web-user-chip">
              <div className="sf-web-user-avatar" style={{ background: "#201E1A" }}>MI</div>
              <div className="sf-web-user-meta">
                <strong>Inspector Meera Iyer</strong>
                <span>OFF-DHU-4921 · Dhule</span>
              </div>
            </div>

            <a href="/login" className="sf-web-signout-btn" title="Sign out">
              <LogOut style={{ width: 14, height: 14 }} />
            </a>
          </div>
        </div>
      </header>

      <main className="sf-web-container">
        {activeSection === "dashboard" && (
          <>
            {/* Officer Duty Banner */}
            <div className="sf-web-officer-banner">
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#C5A059", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Legal Metrology Enforcement Command
                </span>
                <h2 style={{ margin: "4px 0", fontSize: "24px", fontWeight: 900, color: "#FAF5EA" }}>
                  Dhule District Enforcement Division
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#C5A059" }}>
                  Authorized Food Safety Officer · Auto-Verification Authority: <strong>ACTIVE</strong> (All inspection logs are tagged VERIFIED immediately)
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="sf-web-officer-duty-chip">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80" }} />
                  ACTIVE ON FIELD
                </span>

                <a href={portalHref("officer", "scan")} className="sf-web-pill-btn" style={{ background: "#C5A059", color: "#201E1A" }}>
                  <span style={{ color: "#201E1A" }}>Start Field Audit</span>
                  <div className="sf-web-pill-arrow" style={{ background: "#201E1A", color: "#FFF" }}>
                    <ArrowRight style={{ width: 15, height: 15 }} />
                  </div>
                </a>
              </div>
            </div>

            {/* Officer Stats Strip */}
            <div className="sf-web-stats-strip">
              <div className="sf-web-stat-card">
                <span>Market Inspections</span>
                <strong>{officerStats.totalScans}</strong>
                <small>In assigned district (Dhule)</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Statutory Violations</span>
                <strong style={{ color: "#C85A32" }}>{officerStats.productsWithIssues}</strong>
                <small>PCR Rule 6 breaches recorded</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Assigned Cases</span>
                <strong style={{ color: "#D35400" }}>{officerStats.pendingInvestigations}</strong>
                <small>Pending physical visits</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Auto-Verified Reports</span>
                <strong style={{ color: "#1E6B4A" }}>{officerStats.compliantProducts}</strong>
                <small>Synced with district register</small>
              </div>
            </div>

            {/* Assigned Investigations Queue */}
            <section>
              <div className="sf-web-section-head">
                <div>
                  <h3>Assigned Field Cases & Grievances Queue</h3>
                  <p>Citizen grievances allocated for physical inspection & statutory verification</p>
                </div>
                <a href={portalHref("officer", "investigations")}>View All Cases &rarr;</a>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {sampleInvestigations.map((inv) => (
                  <div key={inv.id} className="sf-web-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#D35400" }}>{inv.id} · Ref: {inv.complaint}</span>
                      <h4 style={{ margin: "3px 0", fontSize: "18px", fontWeight: 800, color: "#201E1A" }}>{inv.product}</h4>
                      <span style={{ fontSize: "12px", color: "#7A6F5D" }}>Jurisdiction: {inv.district} · Assigned on {inv.assigned}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span className="sf-web-badge sf-web-badge-warn">
                        {inv.status}
                      </span>

                      <a href={portalHref("officer", `investigations/${inv.id}`)} className="sf-web-pill-btn">
                        <span>Inspect & Record Findings</span>
                        <div className="sf-web-pill-arrow">
                          <ArrowRight style={{ width: 15, height: 15 }} />
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* SECTION: OFFICER SCAN */}
        {activeSection === "scan" && (
          <CitizenScanner
            onScanComplete={(newScan) => {
              setSelectedScanItem(newScan);
            }}
          />
        )}

        {/* SECTION: OFFICER INVESTIGATIONS */}
        {activeSection === "investigations" && !isInvestigationDetail && (
          <div>
            <div className="sf-web-section-head">
              <div>
                <h3>Assigned Field Cases Docket</h3>
                <p>Enforcement cases assigned to your badge in Dhule District</p>
              </div>
              <a href={portalHref("officer", "scan")}>+ Launch Field Scanner &rarr;</a>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {sampleInvestigations.map((inv) => (
                <div key={inv.id} className="sf-web-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#D35400" }}>{inv.id} · Grievance: {inv.complaint}</span>
                    <h4 style={{ margin: "3px 0", fontSize: "18px", fontWeight: 800, color: "#201E1A" }}>{inv.product}</h4>
                    <span style={{ fontSize: "12px", color: "#7A6F5D" }}>{inv.district} · Assigned on {inv.assigned}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span className="sf-web-badge sf-web-badge-warn">
                      {inv.status}
                    </span>

                    <a href={portalHref("officer", `investigations/${inv.id}`)} className="sf-web-pill-btn">
                      <span>Inspect Case</span>
                      <div className="sf-web-pill-arrow">
                        <ArrowRight style={{ width: 15, height: 15 }} />
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-SECTION: INVESTIGATION DETAIL */}
        {isInvestigationDetail && (
          <div style={{ maxWidth: 840, margin: "0 auto" }}>
            <div className="sf-web-section-head">
              <div>
                <h3>Investigation Case File: INV-873</h3>
                <p>Almond Oat Energy Bar · Retailer: Indiranagar Market</p>
              </div>
              <a href={portalHref("officer", "investigations")}>&larr; Back to Cases</a>
            </div>

            <div className="sf-web-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {officerActionSaved && (
                <div style={{ background: "#EBF5F0", border: "1px solid #C4E2D3", borderRadius: 12, padding: 14, color: "#1E6B4A", fontSize: "13px" }}>
                  <CheckCircle2 style={{ width: 16, height: 16, display: "inline", verticalAlign: "middle", marginRight: 6 }} />
                  Record saved! Synced with District Legal Metrology Register (Auto-Verified).
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await complaintsApi.updateStatus("GRV-2048", {
                      status: investigationStatus,
                      note: officerNote,
                    });
                  } catch (err) {
                    console.warn("Officer updateStatus notice:", err);
                  }
                  setOfficerActionSaved(true);
                }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div className="sf-demo-field">
                  <label>Update Investigation Status</label>
                  <select
                    value={investigationStatus}
                    onChange={(e) => setInvestigationStatus(e.target.value)}
                  >
                    <option value="under_investigation">Under Field Investigation</option>
                    <option value="verified_genuine">Verified Genuine Violation</option>
                    <option value="verified_not_genuine">False Alarm / Compliant</option>
                    <option value="action_taken">Notice Issued / Action Taken</option>
                  </select>
                </div>

                <div className="sf-demo-field">
                  <label>Officer Inspection Observations & Seized Batch Details</label>
                  <textarea
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    required
                    placeholder="Record retailer name, seized batch numbers, or inspection notes..."
                  />
                </div>

                <button type="submit" className="sf-web-pill-btn" style={{ alignSelf: "flex-start" }}>
                  <span>Save Record to District Register</span>
                  <div className="sf-web-pill-arrow">
                    <ArrowRight style={{ width: 15, height: 15 }} />
                  </div>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SECTION: OFFICER SETTINGS */}
        {activeSection === "settings" && (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="sf-web-section-head">
              <div>
                <h3>Enforcement Officer Profile</h3>
                <p>Food Safety Enforcement Division credentials</p>
              </div>
              <a href={portalHref("officer", "dashboard")}>&larr; Back</a>
            </div>

            <div className="sf-web-card" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="sf-demo-field">
                <label>Officer Name</label>
                <input type="text" readOnly value="Inspector Meera Iyer" />
              </div>
              <div className="sf-demo-field">
                <label>Badge Number</label>
                <input type="text" readOnly value="OFF-DHU-4921" />
              </div>
              <div className="sf-demo-field">
                <label>District Jurisdiction</label>
                <input type="text" readOnly value="DHULE / MAHARASHTRA" />
              </div>

              <div className="sf-demo-toggle-line">
                <div>
                  <strong>Auto-Verification Status</strong>
                  <div style={{ color: "#7A6F5D", fontSize: "11px" }}>Reports submitted by your badge bypass manual approval.</div>
                </div>
                <input type="checkbox" defaultChecked />
              </div>

              <a
                href="/login"
                className="sf-web-pill-secondary"
                style={{ alignSelf: "flex-start", color: "#B91C1C", borderColor: "#B91C1C" }}
              >
                <LogOut style={{ width: 15, height: 15 }} />
                Sign Out
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ==========================================================================
   3. ADMIN WEB CONSOLE VIEW (Regulatory Oversight)
   ========================================================================== */

type AdminWebProps = {
  activeSection: string;
  switchRole: (r: SafeFoodRole) => void;
  newOfficerName: string;
  setNewOfficerName: (v: string) => void;
  newOfficerDistrict: string;
  setNewOfficerDistrict: (v: string) => void;
  officerAddedMessage: boolean;
  setOfficerAddedMessage: (v: boolean) => void;
};

function AdminWebView({
  activeSection,
  switchRole,
  newOfficerName,
  setNewOfficerName,
  newOfficerDistrict,
  setNewOfficerDistrict,
  officerAddedMessage,
  setOfficerAddedMessage,
}: AdminWebProps) {
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Monthly");
  const [systemHealth, setSystemHealth] = useState<{ status: string; uptime: number; timestamp?: string } | null>(null);
  const [districtOverview, setDistrictOverview] = useState<any>(null);
  const [officersFleet, setOfficersFleet] = useState<any[]>([
    { id: "#OFF-901", name: "Insp. Rajesh Patil", district: "Dhule Urban", activeCases: 14, status: "Active On-Duty" },
    { id: "#OFF-902", name: "Insp. Sneha Deshmukh", district: "Pune Central", activeCases: 9, status: "Active On-Duty" },
    { id: "#OFF-903", name: "Insp. Amit Kulkarni", district: "Mumbai Metro", activeCases: 22, status: "In Transit" },
  ]);
  const [reportsList, setReportsList] = useState<any[]>(sampleComplaints);

  useEffect(() => {
    // 1. Health API (GET /api/v1/health)
    healthApi.check().then((h) => setSystemHealth(h)).catch((e) => console.warn("Health check notice:", e));

    // 2. Districts Overview (GET /api/v1/districts/overview)
    districtsApi.getOverview().then((ov) => setDistrictOverview(ov)).catch((e) => console.warn("District overview notice:", e));

    // 3. Officers fleet (GET /api/v1/districts/officers)
    districtsApi.listOfficers().then((ofs) => {
      if (Array.isArray(ofs) && ofs.length > 0) {
        const mapped = ofs.map((o: any) => ({
          id: `#OFF-${o.badgeNumber || o.id?.slice(-3) || "904"}`,
          name: o.name || "Enforcement Officer",
          district: o.district || "Maharashtra",
          activeCases: o.activeCases ?? 0,
          status: o.isActive ? "Active On-Duty" : "Standby",
        }));
        setOfficersFleet((prev) => [...mapped, ...prev.filter(p => !mapped.some((m: any) => m.name === p.name))]);
      }
    }).catch((e) => console.warn("Officers list notice:", e));

    // 4. District Reports / Grievances (GET /api/v1/districts/reports)
    districtsApi.listReports().then((reps) => {
      if (Array.isArray(reps) && reps.length > 0) {
        setReportsList(reps);
      }
    }).catch((e) => console.warn("Reports list notice:", e));
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
          {/* Logo & Platform Badge */}
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

            {/* Notification alert button */}
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

        {/* 3. DASHBOARD MAIN VIEW (SafeFood Domain Data) */}
        {activeSection === "dashboard" && (
          <>
            {/* TOP 3 COLUMNS GRID */}
            <div className="sf-admin-top-grid">
              {/* COL 1: STACKED STAT CARDS */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Stat 1 */}
                <div className="sf-admin-stat-card">
                  <div className="sf-admin-stat-top">
                    <span className="sf-admin-stat-title">Packaged Products Audited</span>
                    <div className="sf-admin-stat-icon-wrap">
                      <TrendingUp style={{ width: 18, height: 18 }} />
                    </div>
                  </div>
                  <div className="sf-admin-stat-value-row">
                    <span className="sf-admin-stat-value">202,324</span>
                    <span className="sf-admin-badge-pill sf-admin-badge-pill-green">
                      +10%
                    </span>
                  </div>
                  <a href={portalHref("admin", "products")} className="sf-admin-stat-link">
                    <span>View Audit Details</span>
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </a>
                </div>

                {/* Stat 2 */}
                <div className="sf-admin-stat-card">
                  <div className="sf-admin-stat-top">
                    <span className="sf-admin-stat-title">Flagged Metrology Violations</span>
                    <div className="sf-admin-stat-icon-wrap">
                      <Store style={{ width: 18, height: 18 }} />
                    </div>
                  </div>
                  <div className="sf-admin-stat-value-row">
                    <span className="sf-admin-stat-value">12,726</span>
                    <span className="sf-admin-badge-pill sf-admin-badge-pill-red">
                      -12%
                    </span>
                  </div>
                  <a href={portalHref("admin", "complaints")} className="sf-admin-stat-link">
                    <span>View Flagged Grievances</span>
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </a>
                </div>
              </div>

              {/* COL 2: BAR CHART CARD (Hatched stripes & solid bars) */}
              <div className="sf-admin-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <span className="sf-admin-stat-title">Statutory Penalties & Fines Tracked</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                      <span className="sf-admin-stat-value">₹5,00,324</span>
                      <span className="sf-admin-badge-pill sf-admin-badge-pill-green">
                        +45%
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748B", padding: 4 }}
                    aria-label="Options"
                  >
                    <MoreHorizontal style={{ width: 18, height: 18 }} />
                  </button>
                </div>

                {/* Legend */}
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, fontSize: 12, color: "#64748B" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0F172A" }} />
                    <span>Verified Compliant</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: "repeating-linear-gradient(45deg, #CBD5E1, #CBD5E1 2px, #F8FAFC 2px, #F8FAFC 4px)",
                        border: "1px solid #94A3B8",
                      }}
                    />
                    <span>Flagged Discrepancies</span>
                  </div>
                </div>

                {/* The Bar Chart */}
                <div className="sf-admin-barchart-container">
                  <div className="sf-admin-barchart-yaxis">
                    <span>1000</span>
                    <span>2000</span>
                    <span>3000</span>
                    <span>4000</span>
                    <span>5000</span>
                    <span>6000</span>
                    <span>7000</span>
                  </div>

                  <div className="sf-admin-barchart-cols">
                    {/* Jan */}
                    <div className="sf-admin-barchart-col">
                      <span className="sf-admin-bar-val">3400</span>
                      <div className="sf-admin-bar-stack">
                        <div className="sf-admin-bar-hatched" style={{ height: 42 }} />
                        <div className="sf-admin-bar-solid" style={{ height: 60 }} />
                      </div>
                      <span className="sf-admin-bar-month sf-admin-bar-month-active">Jan</span>
                    </div>

                    {/* Feb */}
                    <div className="sf-admin-barchart-col">
                      <span className="sf-admin-bar-val">2800</span>
                      <div className="sf-admin-bar-stack">
                        <div className="sf-admin-bar-hatched" style={{ height: 48 }} />
                        <div className="sf-admin-bar-solid" style={{ height: 45 }} />
                      </div>
                      <span className="sf-admin-bar-month">Feb</span>
                    </div>

                    {/* Mar */}
                    <div className="sf-admin-barchart-col">
                      <span className="sf-admin-bar-val">4000</span>
                      <div className="sf-admin-bar-stack">
                        <div className="sf-admin-bar-hatched" style={{ height: 35 }} />
                        <div className="sf-admin-bar-solid" style={{ height: 75 }} />
                      </div>
                      <span className="sf-admin-bar-month">Mar</span>
                    </div>

                    {/* May */}
                    <div className="sf-admin-barchart-col">
                      <span className="sf-admin-bar-val">2500</span>
                      <div className="sf-admin-bar-stack">
                        <div className="sf-admin-bar-hatched" style={{ height: 50 }} />
                        <div className="sf-admin-bar-solid" style={{ height: 40 }} />
                      </div>
                      <span className="sf-admin-bar-month">May</span>
                    </div>

                    {/* Apr */}
                    <div className="sf-admin-barchart-col">
                      <span className="sf-admin-bar-val">4500</span>
                      <div className="sf-admin-bar-stack">
                        <div className="sf-admin-bar-hatched" style={{ height: 26 }} />
                        <div className="sf-admin-bar-solid" style={{ height: 95 }} />
                      </div>
                      <span className="sf-admin-bar-month">Apr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COL 3: RADIAL DONUT STATS CARD */}
              <div className="sf-admin-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="sf-admin-stat-title" style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                    Category Audit Distribution
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: "#64748B",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <span>{selectedTimeframe}</span>
                    <ChevronDown style={{ width: 13, height: 13 }} />
                  </div>
                </div>

                {/* Donut Graphic */}
                <div className="sf-admin-donut-container">
                  <div className="sf-admin-donut-wrapper">
                    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                      {/* Segment 1: Light Grey (Dairy) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#E2E8F0"
                        strokeWidth="14"
                        strokeDasharray="238"
                        strokeDashoffset="60"
                      />
                      {/* Segment 2: Medium Grey (Edible Oils) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#94A3B8"
                        strokeWidth="14"
                        strokeDasharray="65 173"
                        strokeDashoffset="0"
                      />
                      {/* Segment 3: Deep Slate (Beverages) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#334155"
                        strokeWidth="14"
                        strokeDasharray="50 188"
                        strokeDashoffset="-70"
                      />
                      {/* Segment 4: Solid Black (Packaged Snacks) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#0F172A"
                        strokeWidth="14"
                        strokeDasharray="75 163"
                        strokeDashoffset="-125"
                      />
                    </svg>

                    <div className="sf-admin-donut-center">
                      <strong>23,324</strong>
                      <span className="sf-admin-badge-pill sf-admin-badge-pill-green">
                        +45%
                      </span>
                    </div>
                  </div>

                  {/* Legend Grid */}
                  <div className="sf-admin-donut-legend-row">
                    <div className="sf-admin-donut-legend-item">
                      <div className="sf-admin-donut-legend-label">
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#CBD5E1" }} />
                        <span>Dairy & Milk</span>
                      </div>
                      <span className="sf-admin-donut-legend-val">89,532</span>
                    </div>

                    <div className="sf-admin-donut-legend-item" style={{ alignItems: "flex-end" }}>
                      <div className="sf-admin-donut-legend-label">
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0F172A" }} />
                        <span>Packaged Snacks</span>
                      </div>
                      <span className="sf-admin-donut-legend-val">1,88,500</span>
                    </div>

                    <div className="sf-admin-donut-legend-item">
                      <div className="sf-admin-donut-legend-label">
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#94A3B8" }} />
                        <span>Edible Oils</span>
                      </div>
                      <span className="sf-admin-donut-legend-val">90,231</span>
                    </div>

                    <div className="sf-admin-donut-legend-item" style={{ alignItems: "flex-end" }}>
                      <div className="sf-admin-donut-legend-label">
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#334155" }} />
                        <span>Flour & Staples</span>
                      </div>
                      <span className="sf-admin-donut-legend-val">88,865</span>
                    </div>
                  </div>

                  <div className="sf-admin-donut-total" style={{ width: "100%" }}>
                    <span>Total Statutory Audits Conducted</span>
                    <strong>3,44,031</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM 2 COLUMNS GRID */}
            <div className="sf-admin-bottom-grid">
              {/* COL 1: RECENT GRIEVANCES & VIOLATIONS TABLE */}
              <div className="sf-admin-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                      Recent Violations & Grievances
                    </h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                      Live feed of citizen scans, label discrepancies, and legal metrology enforcement actions.
                    </p>
                  </div>
                  <a
                    href={portalHref("admin", "complaints")}
                    className="sf-admin-btn-outline"
                    style={{ fontSize: 12, padding: "6px 14px" }}
                  >
                    <span>View All</span>
                    <ArrowRight style={{ width: 13, height: 13 }} />
                  </a>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table className="sf-admin-table">
                    <thead>
                      <tr>
                        <th>Docket ID</th>
                        <th>Packaged Food Item</th>
                        <th>Filing Date</th>
                        <th>Jurisdiction</th>
                        <th>Statutory Penalty</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600, color: "#0F172A" }}>#GRV-20841</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                background: "#DCFCE7",
                                display: "grid",
                                placeItems: "center",
                                fontSize: 14,
                              }}
                            >
                              🫒
                            </div>
                            <span style={{ fontWeight: 600 }}>Almond Oat Energy Bar 40g</span>
                          </div>
                        </td>
                        <td>28 Mar 2025</td>
                        <td>Dhule Urban</td>
                        <td style={{ fontWeight: 700, color: "#0F172A" }}>₹25,000.00</td>
                        <td>
                          <span className="sf-admin-status-chip sf-admin-status-inprogress">
                            In Progress
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8" }}
                          >
                            <MoreHorizontal style={{ width: 16, height: 16 }} />
                          </button>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ fontWeight: 600, color: "#0F172A" }}>#GRV-20835</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                background: "#FEF3C7",
                                display: "grid",
                                placeItems: "center",
                                fontSize: 14,
                              }}
                            >
                              🥛
                            </div>
                            <span style={{ fontWeight: 600 }}>Farm Fresh Toned Milk 500ml</span>
                          </div>
                        </td>
                        <td>27 Mar 2025</td>
                        <td>Pune Central</td>
                        <td style={{ fontWeight: 700, color: "#0F172A" }}>₹15,000.00</td>
                        <td>
                          <span className="sf-admin-status-chip sf-admin-status-complete">
                            Complete
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8" }}
                          >
                            <MoreHorizontal style={{ width: 16, height: 16 }} />
                          </button>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ fontWeight: 600, color: "#0F172A" }}>#GRV-20819</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                background: "#E0F2FE",
                                display: "grid",
                                placeItems: "center",
                                fontSize: 14,
                              }}
                            >
                              🌾
                            </div>
                            <span style={{ fontWeight: 600 }}>Golden Harvest Basmati Rice 5kg</span>
                          </div>
                        </td>
                        <td>26 Mar 2025</td>
                        <td>Mumbai Metro</td>
                        <td style={{ fontWeight: 700, color: "#0F172A" }}>₹10,000.00</td>
                        <td>
                          <span className="sf-admin-status-chip sf-admin-status-waiting">
                            Waiting
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8" }}
                          >
                            <MoreHorizontal style={{ width: 16, height: 16 }} />
                          </button>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ fontWeight: 600, color: "#0F172A" }}>#GRV-20798</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                background: "#F1F5F9",
                                display: "grid",
                                placeItems: "center",
                                fontSize: 14,
                              }}
                            >
                              🍟
                            </div>
                            <span style={{ fontWeight: 600 }}>Crispy Masala Chips 50g</span>
                          </div>
                        </td>
                        <td>25 Mar 2025</td>
                        <td>Nashik Rural</td>
                        <td style={{ fontWeight: 700, color: "#0F172A" }}>₹50,000.00</td>
                        <td>
                          <span className="sf-admin-status-chip sf-admin-status-notice">
                            Notice Issued
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8" }}
                          >
                            <MoreHorizontal style={{ width: 16, height: 16 }} />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* COL 2: TOP FLAGGED PRODUCT & MINI BARS */}
              <div className="sf-admin-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                    Top Flagged Category
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: "#64748B",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <span>Monthly</span>
                    <ChevronDown style={{ width: 13, height: 13 }} />
                  </div>
                </div>

                {/* Highlight Product Box */}
                <div className="sf-admin-product-highlight">
                  <div className="sf-admin-product-info">
                    <div className="sf-admin-product-thumb">
                      🛢️
                    </div>
                    <div className="sf-admin-product-meta">
                      <h5>Refined Mustard Oil 1L Pouch</h5>
                      <p>Brand Swastik · Missing Packer Address & Customer Care</p>
                      <div className="sf-price">₹45,000 Penalty Notice</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#0F172A" }} />
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1" }} />
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1" }} />
                  </div>
                </div>

                {/* Mini Bars Chart */}
                <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#64748B" }}>
                  Weekly Enforcements Dispatched:
                </div>
                <div className="sf-admin-minibars">
                  <div className="sf-admin-minibar-col">
                    <span className="sf-admin-minibar-val">840</span>
                    <div className="sf-admin-minibar-pillar" style={{ height: 14 }} />
                    <span className="sf-admin-minibar-day">Tue</span>
                  </div>

                  <div className="sf-admin-minibar-col">
                    <span className="sf-admin-minibar-val">2000</span>
                    <div className="sf-admin-minibar-pillar" style={{ height: 45 }} />
                    <span className="sf-admin-minibar-day">Wed</span>
                  </div>

                  <div className="sf-admin-minibar-col">
                    <span className="sf-admin-minibar-val">6000</span>
                    <div className="sf-admin-minibar-pillar" style={{ height: 95 }} />
                    <span className="sf-admin-minibar-day">Thu</span>
                  </div>

                  <div className="sf-admin-minibar-col">
                    <span className="sf-admin-minibar-val">1200</span>
                    <div className="sf-admin-minibar-pillar" style={{ height: 30 }} />
                    <span className="sf-admin-minibar-day">Fri</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 4. OFFICERS SECTION */}
        {activeSection === "officers" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
            <div className="sf-admin-card">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                Enforcement Fleet Directory
              </h3>
              <table className="sf-admin-table">
                <thead>
                  <tr>
                    <th>Officer ID</th>
                    <th>Name</th>
                    <th>Jurisdiction</th>
                    <th>Active Cases</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {officersFleet.map((officer: any, idx: number) => (
                    <tr key={officer.id || idx}>
                      <td>{officer.id}</td>
                      <td><strong>{officer.name}</strong></td>
                      <td>{officer.district}</td>
                      <td>{officer.activeCases ?? 0}</td>
                      <td>
                        <span className={`sf-admin-status-chip ${officer.status.includes('Active') ? 'sf-admin-status-complete' : 'sf-admin-status-waiting'}`}>
                          {officer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sf-admin-card">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                Deploy Field Officer
              </h3>
              {officerAddedMessage && (
                <div style={{ background: "#DCFCE7", border: "1px solid #BBF7D0", borderRadius: 10, padding: 12, color: "#15803D", fontSize: 13, marginBottom: 14 }}>
                  Officer deployed to district {newOfficerDistrict} via Districts API!
                </div>
              )}
              <form
                onSubmit={handleDeployOfficer}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div className="sf-demo-field">
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Officer Full Name</label>
                  <input
                    type="text"
                    required
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1", outline: "none" }}
                    value={newOfficerName}
                    onChange={(e) => setNewOfficerName(e.target.value)}
                    placeholder="e.g. Inspector Anil Shinde"
                  />
                </div>
                <div className="sf-demo-field">
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Assigned District</label>
                  <select
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1", outline: "none" }}
                    value={newOfficerDistrict}
                    onChange={(e) => setNewOfficerDistrict(e.target.value)}
                  >
                    <option value="DHULE">DHULE</option>
                    <option value="PUNE">PUNE</option>
                    <option value="MUMBAI">MUMBAI</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="sf-admin-btn-outline"
                  style={{ background: "#0F172A", color: "#FFFFFF", justifyContent: "center", marginTop: 8 }}
                >
                  <span>Deploy Officer</span>
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 5. PURCHASES & GRIEVANCES SECTION */}
        {activeSection === "complaints" && (
          <div className="sf-admin-card">
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              All Filed Grievances & Audit Actions
            </h3>
            <table className="sf-admin-table">
              <thead>
                <tr>
                  <th>Case Id</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Violation Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportsList.map((c: any) => (
                  <tr key={c.id || c._id}>
                    <td style={{ fontWeight: 700, color: "#0F172A" }}>{c.complaintNumber || c.id}</td>
                    <td><strong>{c.product || c.productName || "Packaged Product"}</strong></td>
                    <td>{c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "Today")}</td>
                    <td>{c.location || `${c.district || "Dhule"}, MH`}</td>
                    <td>Legal Metrology Decl. Missing</td>
                    <td>
                      <span className="sf-admin-status-chip sf-admin-status-inprogress">
                        {c.status || "Under Review"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. PRODUCTS CATALOG SECTION */}
        {activeSection === "products" && (
          <div className="sf-admin-card">
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              Packaged Food Products Compliance Registry
            </h3>
            <table className="sf-admin-table">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Product Name</th>
                  <th>Manufacturer / Packer</th>
                  <th>Net Quantity</th>
                  <th>Compliance Score</th>
                </tr>
              </thead>
              <tbody>
                {sampleScans.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.id}</td>
                    <td><strong>{s.product}</strong></td>
                    <td>{s.category}</td>
                    <td>{s.date}</td>
                    <td>
                      <span className={`sf-admin-badge-pill ${s.warning ? "sf-admin-badge-pill-red" : "sf-admin-badge-pill-green"}`}>
                        {s.warning ? "Flagged for Audit" : "100% Compliant"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. CITIZENS SECTION */}
        {activeSection === "users" && (
          <div className="sf-admin-card">
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              Citizen Consumer Profiles
            </h3>
            <p style={{ color: "#64748B", fontSize: 13, marginBottom: 16 }}>
              Registered citizens actively scanning food labels and submitting statutory reports.
            </p>
            <table className="sf-admin-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Citizen Name</th>
                  <th>District</th>
                  <th>Scans Submitted</th>
                  <th>Verified Reports</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#CIT-401</td>
                  <td><strong>Rohan Sharma</strong></td>
                  <td>Dhule</td>
                  <td>28</td>
                  <td><span className="sf-admin-status-chip sf-admin-status-complete">6 Verified</span></td>
                </tr>
                <tr>
                  <td>#CIT-402</td>
                  <td><strong>Pooja Deshmukh</strong></td>
                  <td>Pune</td>
                  <td>45</td>
                  <td><span className="sf-admin-status-chip sf-admin-status-complete">11 Verified</span></td>
                </tr>
                <tr>
                  <td>#CIT-403</td>
                  <td><strong>Karan Joshi</strong></td>
                  <td>Mumbai</td>
                  <td>19</td>
                  <td><span className="sf-admin-status-chip sf-admin-status-complete">4 Verified</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 8. ANALYTICS & SETTINGS FALLBACKS */}
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

