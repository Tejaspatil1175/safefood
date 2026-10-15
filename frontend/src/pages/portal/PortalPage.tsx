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
import { AdminWebView } from "./components/AdminWebView";
import { AppFloatingFooter } from "./components/AppFloatingFooter";
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
  const [officerUser, setOfficerUser] = useState<any>(null);
  const [liveInvestigations, setLiveInvestigations] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [officerStats, setOfficerStats] = useState({
    totalScans: 0,
    compliantProducts: 0,
    productsWithIssues: 0,
    pendingInvestigations: 0,
  });

  const fetchOfficerData = async () => {
    // 1. Fetch authenticated officer profile
    try {
      const u: any = await authApi.getMe();
      if (u) setOfficerUser(u);
    } catch {
      const stored = getStoredUser();
      if (stored) setOfficerUser(stored);
    }

    // 2. Fetch live cases / grievances from MongoDB complaints API
    setLoadingCases(true);
    try {
      const res: any = await complaintsApi.list();
      const rawComplaints = Array.isArray(res) ? res : res?.items || res?.complaints || [];
      const mapped = rawComplaints.map((c: any, idx: number) => {
        const productName =
          c.productName ||
          c.product ||
          c.scan?.product?.name ||
          c.scan?.fields?.brand?.value ||
          (c.violations && c.violations.length > 0 ? c.violations[0].field : null) ||
          "Packaged Food Item";

        const invId = `INV-${c.complaintNumber?.replace(/[^0-9]/g, "") || String(c._id || c.id || idx).slice(-4)}`;
        const complaintRef = c.complaintNumber || `#GRV-${String(c._id || c.id || idx).slice(-4)}`;
        const districtStr = c.district || "DHULE";
        const assignedDate = c.createdAt
          ? new Date(c.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently";

        return {
          id: invId,
          complaintId: c._id || c.id,
          complaint: complaintRef,
          product: productName,
          district: `${districtStr}, Maharashtra`,
          rawDistrict: districtStr,
          assigned: assignedDate,
          status: c.status || "IN_REVIEW",
          violations: c.violations || [],
          userNote: c.userNote || c.description,
          raw: c,
        };
      });
      setLiveInvestigations(mapped);
    } catch (err) {
      console.warn("Officer complaints fetch notice:", err);
    } finally {
      setLoadingCases(false);
    }

    // 3. Fetch live officer statistics
    try {
      const data = await officerApi.getStats();
      if (data) {
        setOfficerStats({
          totalScans: data.totalScans ?? 0,
          compliantProducts: data.compliantProducts ?? 0,
          productsWithIssues: data.productsWithIssues ?? 0,
          pendingInvestigations: data.pendingInvestigations ?? 0,
        });
      }
    } catch (err) {
      console.warn("Officer stats fetch notice:", err);
    }
  };

  useEffect(() => {
    fetchOfficerData();
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

            <div className="sf-web-user-chip">
              <div className="sf-web-user-avatar" style={{ background: "#201E1A" }}>
                {(officerUser?.name || "Inspector Rajesh Patil")
                  .split(" ")
                  .filter(Boolean)
                  .map((w: string) => w.charAt(0).toUpperCase())
                  .slice(0, 2)
                  .join("") || "RP"}
              </div>
              <div className="sf-web-user-meta">
                <strong>{officerUser?.name || "Inspector Rajesh Patil"}</strong>
                <span>{officerUser?.badgeNumber || "OFF-DHL-101"} · {officerUser?.district || "Dhule"}</span>
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
                  {officerUser?.district ? `${officerUser.district} District Enforcement Division` : "Dhule District Enforcement Division"}
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
                <small>In assigned district ({officerUser?.district || "Dhule"})</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Statutory Violations</span>
                <strong style={{ color: "#C85A32" }}>{officerStats.productsWithIssues}</strong>
                <small>PCR Rule 6 breaches recorded</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Assigned Cases</span>
                <strong style={{ color: "#D35400" }}>{liveInvestigations.length}</strong>
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

              {loadingCases ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#7A6F5D" }}>
                  Loading assigned cases from live database...
                </div>
              ) : liveInvestigations.length === 0 ? (
                <div className="sf-web-card" style={{ padding: "30px", textAlign: "center", color: "#7A6F5D" }}>
                  No active investigations assigned in your district right now.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 16 }}>
                  {liveInvestigations.map((inv) => (
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

                        <a href={portalHref("officer", `investigations/${inv.complaintId || inv.id}`)} className="sf-web-pill-btn">
                          <span>Inspect & Record Findings</span>
                          <div className="sf-web-pill-arrow">
                            <ArrowRight style={{ width: 15, height: 15 }} />
                          </div>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <p>Enforcement cases assigned to your badge in {officerUser?.district || "Dhule"} District</p>
              </div>
              <a href={portalHref("officer", "scan")}>+ Launch Field Scanner &rarr;</a>
            </div>

            {loadingCases ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#7A6F5D" }}>
                Loading assigned cases...
              </div>
            ) : liveInvestigations.length === 0 ? (
              <div className="sf-web-card" style={{ padding: "30px", textAlign: "center", color: "#7A6F5D" }}>
                No active dockets assigned in your jurisdiction.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {liveInvestigations.map((inv) => (
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

                      <a href={portalHref("officer", `investigations/${inv.complaintId || inv.id}`)} className="sf-web-pill-btn">
                        <span>Inspect Case</span>
                        <div className="sf-web-pill-arrow">
                          <ArrowRight style={{ width: 15, height: 15 }} />
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <input type="text" readOnly value={officerUser?.name || "Inspector Rajesh Patil"} />
              </div>
              <div className="sf-demo-field">
                <label>Badge Number</label>
                <input type="text" readOnly value={officerUser?.badgeNumber || "OFF-DHL-101"} />
              </div>
              <div className="sf-demo-field">
                <label>District Jurisdiction</label>
                <input type="text" readOnly value={`${officerUser?.district || "DHULE"} / MAHARASHTRA`} />
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

      {/* Floating Bottom Navigation Tabbar */}
      <AppFloatingFooter role="officer" activeSection={activeSection} />
    </div>
  );
}


