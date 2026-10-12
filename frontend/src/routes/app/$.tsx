import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  Smartphone,
  HelpCircle,
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

export const Route = createFileRoute("/app/$")({
  head: () => ({
    meta: [
      { title: "Workspace — SafeFood Portal" },
      { name: "description", content: "SafeFood interactive portal for citizens, officers, and administrators." },
    ],
  }),
  component: AppPortalPage,
});

function AppPortalPage() {
  const { _splat } = Route.useParams();
  const locationInfo = parsePortalLocation(_splat);
  const { role, activeSection, isInvestigationDetail, isComplaintCreate, isComplaintDetail } = locationInfo;
  const currentRoleConfig = portalRoles[role];

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

  // Render role-specific experiences
  if (role === "user") {
    return (
      <CitizenAppView
        activeSection={activeSection}
        isComplaintCreate={isComplaintCreate}
        isComplaintDetail={isComplaintDetail}
        scanItem={scanItem}
        setSelectedScanItem={setSelectedScanItem}
        newComplaintDistrict={newComplaintDistrict}
        setNewComplaintDistrict={setNewComplaintDistrict}
        newComplaintNote={newComplaintNote}
        setNewComplaintNote={setNewComplaintNote}
        complaintSubmitted={complaintSubmitted}
        setComplaintSubmitted={setComplaintSubmitted}
        switchRole={switchRole}
      />
    );
  }

  if (role === "officer") {
    return (
      <OfficerAppView
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
    <AdminConsoleView
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
   1. CITIZEN APP EXPERIENCE (Simple, mobile-first consumer application)
   ========================================================================== */

type CitizenAppProps = {
  activeSection: string;
  isComplaintCreate: boolean;
  isComplaintDetail: boolean;
  scanItem: (typeof sampleScans)[number];
  setSelectedScanItem: (item: (typeof sampleScans)[number]) => void;
  newComplaintDistrict: string;
  setNewComplaintDistrict: (v: string) => void;
  newComplaintNote: string;
  setNewComplaintNote: (v: string) => void;
  complaintSubmitted: boolean;
  setComplaintSubmitted: (v: boolean) => void;
  switchRole: (r: SafeFoodRole) => void;
};

function CitizenAppView({
  activeSection,
  isComplaintCreate,
  isComplaintDetail,
  scanItem,
  setSelectedScanItem,
  newComplaintDistrict,
  setNewComplaintDistrict,
  newComplaintNote,
  setNewComplaintNote,
  complaintSubmitted,
  setComplaintSubmitted,
  switchRole,
}: CitizenAppProps) {
  return (
    <div className="sf-demo sf-app-root">
      <div className="sf-app-shell">
        {/* Top App Header */}
        <header className="sf-app-header">
          <div className="sf-app-header-user">
            <div className="sf-app-avatar">AS</div>
            <div className="sf-app-user-meta">
              <h2>Aarav Sharma</h2>
              <span>
                <MapPin style={{ width: 12, height: 12, color: "var(--deep-green)" }} />
                Dhule, Maharashtra
              </span>
            </div>
          </div>

          <div className="sf-app-header-actions">
            <select
              className="sf-app-role-select"
              value="user"
              onChange={(e) => switchRole(e.target.value as SafeFoodRole)}
              aria-label="Switch demo mode"
            >
              <option value="user">📱 Citizen App</option>
              <option value="officer">🛡️ Officer App</option>
              <option value="admin">🏢 Admin Panel</option>
            </select>

            <a href="/login" className="sf-app-signout-btn" title="Sign out">
              <LogOut style={{ width: 15, height: 15 }} />
            </a>
          </div>
        </header>

        {/* Main Body */}
        <main className="sf-app-body">
          {/* SECTION: CITIZEN HOME */}
          {activeSection === "dashboard" && (
            <>
              {/* Hero Scanner Card */}
              <div className="sf-app-hero-scanner">
                <div className="sf-app-hero-badge">
                  <Sparkles style={{ width: 13, height: 13 }} />
                  AI Label & Food Safety Check
                </div>
                <div className="sf-app-hero-content">
                  <h3>Scan Any Food Label</h3>
                  <p>
                    Point camera at MRP, expiry date, address, or FSSAI number. Instant check for illegal tiny fonts and fake declarations.
                  </p>
                </div>
                <a href={portalHref("user", "scan")} className="sf-app-scan-btn">
                  <Camera style={{ width: 18, height: 18 }} />
                  Tap to Scan Food Package
                </a>
              </div>

              {/* Quick Action Tiles */}
              <div className="sf-app-action-grid">
                <a href={portalHref("user", "scan")} className="sf-app-action-tile">
                  <div className="sf-app-action-icon">
                    <ScanLine />
                  </div>
                  <span>Scan Food</span>
                </a>
                <a href={portalHref("user", "complaints/new")} className="sf-app-action-tile">
                  <div className="sf-app-action-icon" style={{ color: "#d97706" }}>
                    <FilePlus2 />
                  </div>
                  <span>Report Issue</span>
                </a>
                <a href={portalHref("user", "history")} className="sf-app-action-tile">
                  <div className="sf-app-action-icon">
                    <History />
                  </div>
                  <span>My Scans</span>
                </a>
                <a href={portalHref("user", "complaints")} className="sf-app-action-tile">
                  <div className="sf-app-action-icon">
                    <FileText />
                  </div>
                  <span>Grievances</span>
                </a>
              </div>

              {/* Active Complaint Status Widget */}
              <div
                style={{
                  border: "1px solid color-mix(in oklab, #f59e0b 40%, var(--sf-line))",
                  borderRadius: 14,
                  padding: "14px 16px",
                  background: "color-mix(in oklab, #f59e0b 8%, var(--background))",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#b45309", display: "flex", alignItems: "center", gap: 5 }}>
                    <AlertTriangle style={{ width: 14, height: 14 }} />
                    ACTIVE GRIEVANCE IN PROGRESS
                  </span>
                  <a
                    href={portalHref("user", "complaints/GRV-2048")}
                    style={{ fontSize: "11px", fontWeight: 700, color: "var(--deep-green)", textDecoration: "none" }}
                  >
                    Track Status &rarr;
                  </a>
                </div>
                <div>
                  <strong style={{ fontSize: "13px" }}>Almond Oat Energy Bar (GRV-2048)</strong>
                  <div style={{ fontSize: "11px", color: "var(--sf-quiet)", marginTop: 2 }}>
                    Assigned to <strong>Inspector Meera Iyer</strong> (Dhule Division) · Field visit conducted today
                  </div>
                </div>
              </div>

              {/* Recent Scans (Card list instead of a database table) */}
              <div>
                <div className="sf-app-section-title">
                  <h4>Recent Food Scans</h4>
                  <a href={portalHref("user", "history")}>View all ({sampleScans.length}) &rarr;</a>
                </div>

                <div className="sf-app-card-list">
                  {sampleScans.map((scan) => (
                    <div key={scan.id} className="sf-app-product-card">
                      <div className="sf-app-product-card-top">
                        <div className="sf-app-product-info">
                          <div className="sf-app-product-thumb">
                            {scan.warning ? (
                              <AlertTriangle style={{ width: 22, height: 22, color: "#d97706" }} />
                            ) : (
                              <CheckCircle2 style={{ width: 22, height: 22, color: "var(--deep-green)" }} />
                            )}
                          </div>
                          <div className="sf-app-product-meta">
                            <strong>{scan.product}</strong>
                            <span>{scan.category} · {scan.date}</span>
                          </div>
                        </div>

                        <span className={`sf-app-badge ${scan.warning ? "sf-app-badge-warn" : "sf-app-badge-ok"}`}>
                          {scan.warning ? "⚠️ Issue Flagged" : "✅ Passed"}
                        </span>
                      </div>

                      <div className="sf-app-product-card-actions">
                        <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>
                          {scan.warning ? "Missing complete packer address" : "All 6 PCR mandatory declarations clear"}
                        </span>
                        {scan.warning ? (
                          <a href={portalHref("user", "complaints/new")}>
                            Report to Officer &rarr;
                          </a>
                        ) : (
                          <a href={portalHref("user", "scan")}>
                            View Check &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consumer Rights Tip */}
              <div
                style={{
                  border: "1px solid var(--sf-line)",
                  borderRadius: 14,
                  padding: "14px 16px",
                  background: "var(--sf-pale)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}
              >
                <ShieldCheck style={{ width: 20, height: 20, color: "var(--deep-green)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ display: "block", marginBottom: 3 }}>Know Your Legal Food Rights</strong>
                  Under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011, it is illegal for food brands to print MRP, expiry dates, or net weight smaller than 2mm font. If you cannot read it clearly, you have the right to report it.
                </div>
              </div>
            </>
          )}

          {/* SECTION: CITIZEN SCAN */}
          {activeSection === "scan" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>Label Scanner & Verification</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--sf-quiet)" }}>
                  Hold package in camera frame to scan mandatory legal declarations under PCR 2011.
                </p>
              </div>

              {/* Camera Viewfinder Simulator */}
              <div className="sf-app-viewfinder">
                <div className="sf-app-viewfinder-scanline" />
                <span style={{ fontSize: "11px", color: "#94a3b8", display: "inline-block", marginBottom: 8 }}>
                  AI CAMERA VIEWFINDER (4-PANEL COMPLIANCE SCAN)
                </span>

                <div className="sf-app-target-box">
                  <ScanLine style={{ width: 44, height: 44, color: "#34d399" }} />
                </div>

                <strong style={{ display: "block", fontSize: "15px", color: "#ffffff", marginTop: 6 }}>
                  {scanItem.product}
                </strong>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  Category: {scanItem.category} · Barcode: 8901234567890
                </span>
              </div>

              {/* Sample Product Switcher Pills */}
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--sf-quiet)" }}>
                  TAP A SAMPLE PRODUCT TO TEST SCAN:
                </span>
                <div className="sf-app-sample-pills">
                  {sampleScans.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`sf-app-sample-pill ${scanItem.id === s.id ? "sf-app-sample-pill-active" : ""}`}
                      onClick={() => setSelectedScanItem(s)}
                    >
                      {s.warning ? "⚠️ " : "✅ "}
                      {s.product}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verdict Summary Card */}
              <div
                style={{
                  border: `1.5px solid ${scanItem.warning ? "#f59e0b" : "var(--deep-green)"}`,
                  borderRadius: 14,
                  padding: 16,
                  background: scanItem.warning ? "color-mix(in oklab, #f59e0b 8%, var(--background))" : "var(--sf-pale)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: scanItem.warning ? "#b45309" : "var(--deep-green)" }}>
                    {scanItem.warning ? "⚠️ COMPLIANCE VIOLATION DETECTED" : "✅ 100% COMPLIANT PACKAGING"}
                  </span>
                  <span className={`sf-app-badge ${scanItem.warning ? "sf-app-badge-warn" : "sf-app-badge-ok"}`}>
                    {scanItem.warning ? "Rule 6 Breach" : "FSSAI + PCR Passed"}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--foreground)", lineHeight: 1.5 }}>
                  {scanItem.warning
                    ? "Incomplete manufacturer/packer address detected. City, district or PIN code is missing, violating Rule 6(1)(a) of Legal Metrology Rules."
                    : "Product displays all mandatory declarations: clear MRP including taxes, net quantity, best before date, complete packer address, and valid 14-digit FSSAI license."}
                </p>
              </div>

              {/* 6 Mandatory Declarations Checklist */}
              <div>
                <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 800 }}>
                  Mandatory Legal Metrology Declarations (PCR 2011)
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {mandatoryDeclarations.map((decl, index) => {
                    const isFailedItem = scanItem.warning && index === 3;
                    const isOk = !isFailedItem && decl.ok;

                    return (
                      <div
                        key={decl.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "11px 14px",
                          borderRadius: 10,
                          border: "1px solid var(--sf-line)",
                          background: isOk ? "var(--background)" : "color-mix(in oklab, #ef4444 8%, var(--background))",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {isOk ? (
                            <CheckCircle2 style={{ width: 18, height: 18, color: "var(--deep-green)", flexShrink: 0 }} />
                          ) : (
                            <X style={{ width: 18, height: 18, color: "#b91c1c", flexShrink: 0 }} />
                          )}
                          <div>
                            <strong style={{ fontSize: "12px", display: "block" }}>{decl.label}</strong>
                            <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>
                              {isFailedItem ? "CRITICAL: Address incomplete without district or PIN" : decl.detail}
                            </span>
                          </div>
                        </div>

                        <span className={`sf-app-badge ${isOk ? "sf-app-badge-ok" : "sf-app-badge-crit"}`}>
                          {isOk ? "PASSED" : "FAILED"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* If warning, Quick Action button to lodge complaint */}
              {scanItem.warning && (
                <a
                  href={portalHref("user", "complaints/new")}
                  className="sf-app-scan-btn"
                  style={{ background: "#b45309", justifyContent: "center" }}
                >
                  <FilePlus2 style={{ width: 17, height: 17 }} />
                  Lodge Grievance for {scanItem.product} &rarr;
                </a>
              )}
            </div>
          )}

          {/* SECTION: CITIZEN HISTORY */}
          {activeSection === "history" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>My Scan History</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--sf-quiet)" }}>
                  All packaged food products scanned with your account.
                </p>
              </div>

              <div className="sf-app-card-list">
                {sampleScans.map((scan) => (
                  <div key={scan.id} className="sf-app-product-card">
                    <div className="sf-app-product-card-top">
                      <div className="sf-app-product-info">
                        <div className="sf-app-product-thumb">
                          {scan.warning ? (
                            <AlertTriangle style={{ width: 22, height: 22, color: "#d97706" }} />
                          ) : (
                            <CheckCircle2 style={{ width: 22, height: 22, color: "var(--deep-green)" }} />
                          )}
                        </div>
                        <div className="sf-app-product-meta">
                          <strong>{scan.product}</strong>
                          <span>Scan ID: {scan.id} · {scan.date}</span>
                        </div>
                      </div>

                      <span className={`sf-app-badge ${scan.warning ? "sf-app-badge-warn" : "sf-app-badge-ok"}`}>
                        {scan.warning ? "⚠️ Check label" : "✅ Looks good"}
                      </span>
                    </div>

                    <div className="sf-app-product-card-actions">
                      <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>Category: {scan.category}</span>
                      <a href={portalHref("user", "scan")}>View Detailed Audit &rarr;</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: CITIZEN COMPLAINTS / GRIEVANCES */}
          {activeSection === "complaints" && !isComplaintCreate && !isComplaintDetail && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>My Filed Grievances</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--sf-quiet)" }}>
                    Track status of complaints sent to District Food Safety Officers.
                  </p>
                </div>
                <a
                  href={portalHref("user", "complaints/new")}
                  className="sf-app-scan-btn"
                  style={{ padding: "8px 14px", fontSize: "12px" }}
                >
                  <Plus style={{ width: 14, height: 14 }} /> New
                </a>
              </div>

              <div className="sf-app-card-list">
                {sampleComplaints.map((c) => (
                  <div key={c.id} className="sf-app-product-card">
                    <div className="sf-app-product-card-top">
                      <div>
                        <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--deep-green)" }}>{c.id}</span>
                        <strong style={{ display: "block", fontSize: "14px", marginTop: 2 }}>{c.product}</strong>
                        <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>{c.location} · {c.date}</span>
                      </div>

                      <span
                        className={`sf-app-badge ${
                          c.status === "Resolved"
                            ? "sf-app-badge-ok"
                            : c.status === "Under investigation"
                              ? "sf-app-badge-warn"
                              : "sf-app-badge-crit"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <div className="sf-app-product-card-actions">
                      <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>
                        Officer: <strong>{c.officer}</strong>
                      </span>
                      <a href={portalHref("user", `complaints/${c.id}`)}>View Timeline &rarr;</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-SECTION: CREATE COMPLAINT */}
          {isComplaintCreate && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>File a Consumer Grievance</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--sf-quiet)" }}>
                  Submit label violation to the District Legal Metrology Officer.
                </p>
              </div>

              {complaintSubmitted ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "36px 20px",
                    border: "1px solid var(--sf-line)",
                    borderRadius: 16,
                    background: "var(--background)",
                  }}
                >
                  <CheckCircle2 style={{ width: 50, height: 50, color: "var(--deep-green)", margin: "0 auto 12px" }} />
                  <h4 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 800 }}>Grievance Submitted!</h4>
                  <p style={{ color: "var(--sf-quiet)", fontSize: "12px", maxWidth: 360, margin: "0 auto 20px" }}>
                    Case ID <strong>GRV-2051</strong> generated. Assigned to the District Food Safety Officer in <strong>{newComplaintDistrict}</strong>.
                  </p>
                  <a href={portalHref("user", "complaints")} className="sf-app-scan-btn" style={{ display: "inline-flex" }}>
                    View in My Grievances &rarr;
                  </a>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setComplaintSubmitted(true);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    background: "var(--background)",
                    border: "1px solid var(--sf-line)",
                    borderRadius: 16,
                    padding: 18,
                  }}
                >
                  <div className="sf-demo-field">
                    <label>Product Detected with Violation</label>
                    <input type="text" readOnly value="Almond Oat Energy Bar (Batch B-4029)" />
                  </div>

                  <div className="sf-demo-field">
                    <label>District Jurisdiction</label>
                    <select value={newComplaintDistrict} onChange={(e) => setNewComplaintDistrict(e.target.value)}>
                      <option value="DHULE">DHULE</option>
                      <option value="PUNE">PUNE</option>
                      <option value="MUMBAI">MUMBAI</option>
                      <option value="BENGALURU URBAN">BENGALURU URBAN</option>
                    </select>
                  </div>

                  <div className="sf-demo-field">
                    <label>Store or Purchase Location</label>
                    <input type="text" required placeholder="e.g. Reliance Fresh, Station Road" />
                  </div>

                  <div className="sf-demo-field">
                    <label>Describe the Packaging Issue</label>
                    <textarea
                      value={newComplaintNote}
                      onChange={(e) => setNewComplaintNote(e.target.value)}
                      required
                      placeholder="e.g. Packer address was completely missing, font size too small to read..."
                    />
                  </div>

                  <div
                    style={{
                      border: "1px dashed var(--sf-line)",
                      borderRadius: 8,
                      padding: 10,
                      background: "var(--sf-pale)",
                      fontSize: "11px",
                      color: "var(--sf-quiet)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Camera style={{ width: 16, height: 16, color: "var(--deep-green)", flexShrink: 0 }} />
                    Label scan photos automatically attached as evidence.
                  </div>

                  <button type="submit" className="sf-app-scan-btn" style={{ marginTop: 6, justifyContent: "center" }}>
                    <Send style={{ width: 16, height: 16 }} />
                    Submit Complaint to Officer &rarr;
                  </button>
                </form>
              )}
            </div>
          )}

          {/* SUB-SECTION: COMPLAINT DETAIL & TIMELINE */}
          {isComplaintDetail && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 2px", fontSize: "18px", fontWeight: 800 }}>Case GRV-2048</h3>
                  <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>Almond Oat Energy Bar</span>
                </div>
                <span className="sf-app-badge sf-app-badge-warn">Under investigation</span>
              </div>

              {/* Progress Steps Timeline */}
              <div
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--sf-line)",
                  borderRadius: 14,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <strong style={{ fontSize: "13px" }}>Investigation Status Steps</strong>

                <div className="sf-demo-timeline">
                  <div className="sf-demo-timeline-step">
                    <span className="sf-demo-timeline-mark"><Check /></span>
                    <div>
                      <strong>1. Grievance Submitted by Citizen</strong>
                      <small>Oct 11, 2026 at 10:45 am · Status: IN_REVIEW</small>
                    </div>
                  </div>
                  <div className="sf-demo-timeline-step">
                    <span className="sf-demo-timeline-mark"><Check /></span>
                    <div>
                      <strong>2. Assigned to Inspector Meera Iyer</strong>
                      <small>Oct 11, 2026 at 02:15 pm · Status: ASSIGNED</small>
                    </div>
                  </div>
                  <div className="sf-demo-timeline-step">
                    <span className="sf-demo-timeline-mark"><Check /></span>
                    <div>
                      <strong>3. Physical Inspection Conducted at Retailer</strong>
                      <small>Oct 12, 2026 at 11:30 am · Status: UNDER_INVESTIGATION</small>
                    </div>
                  </div>
                  <div className="sf-demo-timeline-step">
                    <span className="sf-demo-timeline-mark" style={{ background: "var(--background)", border: "1px solid var(--sf-line)", color: "var(--sf-quiet)" }}>4</span>
                    <div>
                      <strong>4. Statutory Notice Issued to Packer</strong>
                      <small>Pending formal response from manufacturer</small>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sf-app-scan-btn"
                  style={{ background: "var(--background)", border: "1px solid var(--sf-line)", color: "var(--foreground)", boxShadow: "none" }}
                  onClick={() => alert("Downloading official statutory complaint PDF.")}
                >
                  <Download style={{ width: 16, height: 16, color: "var(--deep-green)" }} />
                  Download PDF Grievance Report
                </button>
              </div>
            </div>
          )}

          {/* SECTION: CITIZEN SETTINGS */}
          {activeSection === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>Account & Profile</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--sf-quiet)" }}>
                  Manage your citizen profile and notification preferences.
                </p>
              </div>

              <div
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--sf-line)",
                  borderRadius: 16,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div className="sf-demo-field">
                  <label>Full Name</label>
                  <input type="text" readOnly value="Aarav Sharma" />
                </div>
                <div className="sf-demo-field">
                  <label>Email Address</label>
                  <input type="text" readOnly value="aarav@safefood.in" />
                </div>
                <div className="sf-demo-field">
                  <label>Assigned District</label>
                  <input type="text" readOnly value="DHULE / MAHARASHTRA" />
                </div>

                <div className="sf-demo-toggle-line">
                  <div>
                    <strong>Food Safety Recall Alerts</strong>
                    <div style={{ color: "var(--sf-quiet)", fontSize: "10px" }}>Receive alerts when non-compliant products are recalled in your district.</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>

                <div className="sf-demo-toggle-line">
                  <div>
                    <strong>Grievance SMS & WhatsApp Updates</strong>
                    <div style={{ color: "var(--sf-quiet)", fontSize: "10px" }}>Instant notifications when an officer inspects your complaint.</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>

                <a
                  href="/login"
                  className="sf-app-scan-btn"
                  style={{ background: "color-mix(in oklab, #ef4444 14%, var(--background))", color: "#b91c1c", boxShadow: "none", border: "1px solid #ef4444", marginTop: 8 }}
                >
                  <LogOut style={{ width: 16, height: 16 }} />
                  Sign Out
                </a>
              </div>
            </div>
          )}
        </main>

        {/* Bottom App Navigation Dock (Sticky thumb-friendly tabs) */}
        <nav className="sf-app-dock" aria-label="App Navigation">
          <div className="sf-app-dock-inner">
            <a
              href={portalHref("user", "dashboard")}
              className={`sf-app-dock-tab ${activeSection === "dashboard" ? "sf-app-dock-tab-active" : ""}`}
            >
              <Home />
              <span>Home</span>
            </a>

            <a
              href={portalHref("user", "history")}
              className={`sf-app-dock-tab ${activeSection === "history" ? "sf-app-dock-tab-active" : ""}`}
            >
              <History />
              <span>Scans</span>
            </a>

            {/* Elevated Center Scan Button */}
            <a href={portalHref("user", "scan")} className="sf-app-dock-scan-btn" title="Scan Label">
              <Camera />
            </a>

            <a
              href={portalHref("user", "complaints")}
              className={`sf-app-dock-tab ${activeSection.startsWith("complaints") ? "sf-app-dock-tab-active" : ""}`}
            >
              <FileText />
              <span>Grievances</span>
            </a>

            <a
              href={portalHref("user", "settings")}
              className={`sf-app-dock-tab ${activeSection === "settings" ? "sf-app-dock-tab-active" : ""}`}
            >
              <User />
              <span>Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. OFFICER APP EXPERIENCE (Fast, field-inspection tool for enforcement)
   ========================================================================== */

type OfficerAppProps = {
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

function OfficerAppView({
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
}: OfficerAppProps) {
  return (
    <div className="sf-demo sf-app-root">
      <div className="sf-app-shell sf-app-shell-officer">
        {/* Tactical Field Header */}
        <header className="sf-app-header">
          <div className="sf-app-header-user">
            <div className="sf-app-avatar sf-app-avatar-officer">MI</div>
            <div className="sf-app-user-meta">
              <h2>Inspector Meera Iyer</h2>
              <span>
                <ShieldCheck style={{ width: 12, height: 12, color: "#34d399" }} />
                OFF-DHU-4921 · Dhule District
              </span>
            </div>
          </div>

          <div className="sf-app-header-actions">
            <select
              className="sf-app-role-select"
              value="officer"
              onChange={(e) => switchRole(e.target.value as SafeFoodRole)}
              aria-label="Switch demo mode"
            >
              <option value="user">📱 Citizen App</option>
              <option value="officer">🛡️ Officer App</option>
              <option value="admin">🏢 Admin Panel</option>
            </select>

            <a href="/login" className="sf-app-signout-btn" title="Sign out">
              <LogOut style={{ width: 15, height: 15 }} />
            </a>
          </div>
        </header>

        {/* Main Body */}
        <main className="sf-app-body">
          {/* SECTION: OFFICER DASHBOARD (FIELD FEED) */}
          {activeSection === "dashboard" && (
            <>
              {/* Field Duty Status Banner */}
              <div className="sf-officer-banner">
                <div>
                  <strong style={{ display: "block", fontSize: "14px" }}>Enforcement Division</strong>
                  <span style={{ color: "#94a3b8", fontSize: "11px" }}>Auto-Verification: ACTIVE</span>
                </div>
                <span className="sf-officer-duty-pill">
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399" }} />
                  ON FIELD DUTY
                </span>
              </div>

              {/* 3 Quick Field Metrics */}
              <div className="sf-officer-stats-row">
                <div className="sf-officer-stat-pill">
                  <strong>48</strong>
                  <span>Market Audits</span>
                </div>
                <div className="sf-officer-stat-pill">
                  <strong style={{ color: "#ef4444" }}>16</strong>
                  <span>Violations</span>
                </div>
                <div className="sf-officer-stat-pill">
                  <strong style={{ color: "#f59e0b" }}>5</strong>
                  <span>Assigned Cases</span>
                </div>
              </div>

              {/* Fast Field Action Button */}
              <a href={portalHref("officer", "scan")} className="sf-app-scan-btn">
                <ScanLine style={{ width: 18, height: 18 }} />
                Conduct Field Inspection Scan &rarr;
              </a>

              {/* Active Assigned Cases (Queue of Case Cards, NOT a database table) */}
              <div>
                <div className="sf-app-section-title">
                  <h4>Assigned Field Cases ({sampleInvestigations.length})</h4>
                  <a href={portalHref("officer", "investigations")}>View all &rarr;</a>
                </div>

                <div className="sf-app-card-list">
                  {sampleInvestigations.map((inv) => (
                    <div key={inv.id} className="sf-case-card">
                      <div className="sf-case-card-header">
                        <div>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--deep-green)" }}>{inv.id}</span>
                          <span style={{ fontSize: "11px", color: "var(--sf-quiet)", marginLeft: 6 }}>({inv.complaint})</span>
                          <strong style={{ display: "block", fontSize: "14px", marginTop: 2 }}>{inv.product}</strong>
                        </div>
                        <span className="sf-app-badge sf-app-badge-warn">{inv.status}</span>
                      </div>

                      <div className="sf-case-card-body">
                        <div><strong>Jurisdiction:</strong> {inv.district}</div>
                        <div><strong>Assigned:</strong> {inv.assigned}</div>
                      </div>

                      <a href={portalHref("officer", `investigations/${inv.id}`)} className="sf-case-card-btn">
                        Open Case & Record Findings &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SECTION: OFFICER SCAN / FIELD AUDIT */}
          {activeSection === "scan" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>Field OCR Inspection Audit</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--sf-quiet)" }}>
                  Conduct statutory check against Rule 6 of PCR 2011 & FSSAI labeling norms.
                </p>
              </div>

              {/* Field Camera Viewfinder */}
              <div className="sf-app-viewfinder">
                <div className="sf-app-viewfinder-scanline" />
                <span style={{ fontSize: "11px", color: "#94a3b8", display: "inline-block", marginBottom: 8 }}>
                  OFFICER FIELD OCR AUDIT (HIGH-PRECISION ZOOM)
                </span>

                <div className="sf-app-target-box">
                  <ScanLine style={{ width: 44, height: 44, color: "#34d399" }} />
                </div>

                <strong style={{ display: "block", fontSize: "15px", color: "#ffffff", marginTop: 6 }}>
                  {scanItem.product}
                </strong>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  Category: {scanItem.category} · Barcode: 8901234567890
                </span>
              </div>

              {/* Sample Product Picker */}
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--sf-quiet)" }}>
                  SAMPLE PACKAGING AUDIT TEST:
                </span>
                <div className="sf-app-sample-pills">
                  {sampleScans.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`sf-app-sample-pill ${scanItem.id === s.id ? "sf-app-sample-pill-active" : ""}`}
                      onClick={() => setSelectedScanItem(s)}
                    >
                      {s.warning ? "⚠️ " : "✅ "}
                      {s.product}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legal Metrology Statutory Checklist */}
              <div>
                <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 800 }}>
                  Statutory Rule 6 Audit Verification
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {mandatoryDeclarations.map((decl, index) => {
                    const isFailedItem = scanItem.warning && index === 3;
                    const isOk = !isFailedItem && decl.ok;

                    return (
                      <div
                        key={decl.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "11px 14px",
                          borderRadius: 10,
                          border: "1px solid var(--sf-line)",
                          background: isOk ? "var(--background)" : "color-mix(in oklab, #ef4444 8%, var(--background))",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {isOk ? (
                            <CheckCircle2 style={{ width: 18, height: 18, color: "var(--deep-green)", flexShrink: 0 }} />
                          ) : (
                            <X style={{ width: 18, height: 18, color: "#b91c1c", flexShrink: 0 }} />
                          )}
                          <div>
                            <strong style={{ fontSize: "12px", display: "block" }}>{decl.label}</strong>
                            <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>
                              {isFailedItem ? "BREACH: Missing packer district / PIN code" : decl.detail}
                            </span>
                          </div>
                        </div>

                        <span className={`sf-app-badge ${isOk ? "sf-app-badge-ok" : "sf-app-badge-crit"}`}>
                          {isOk ? "COMPLIANT" : "VIOLATION"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Enforcement Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {scanItem.warning && (
                  <button
                    type="button"
                    className="sf-app-scan-btn"
                    style={{ background: "#b91c1c" }}
                    onClick={() => alert("Statutory Enforcement Violation logged in Dhule District Register (Auto-Verified).")}
                  >
                    File Enforcement Report (Auto-Verified) &rarr;
                  </button>
                )}
                <button
                  type="button"
                  className="sf-app-scan-btn"
                  style={{ background: "var(--background)", border: "1px solid var(--sf-line)", color: "var(--foreground)", boxShadow: "none" }}
                  onClick={() => alert("Drafting Statutory Notice under Sec 36 of Legal Metrology Act.")}
                >
                  Draft Statutory Notice under Sec 36 &rarr;
                </button>
              </div>
            </div>
          )}

          {/* SECTION: OFFICER INVESTIGATIONS LIST */}
          {activeSection === "investigations" && !isInvestigationDetail && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>Field Cases Queue</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--sf-quiet)" }}>
                  Grievances assigned for field verification in Dhule District.
                </p>
              </div>

              <div className="sf-app-card-list">
                {sampleInvestigations.map((inv) => (
                  <div key={inv.id} className="sf-case-card">
                    <div className="sf-case-card-header">
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--deep-green)" }}>{inv.id}</span>
                        <strong style={{ display: "block", fontSize: "14px", marginTop: 2 }}>{inv.product}</strong>
                        <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>Ref: {inv.complaint} · {inv.district}</span>
                      </div>
                      <span className="sf-app-badge sf-app-badge-warn">{inv.status}</span>
                    </div>

                    <a href={portalHref("officer", `investigations/${inv.id}`)} className="sf-case-card-btn">
                      Inspect & Record Findings &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-SECTION: INVESTIGATION CASE DETAIL & STATUS UPDATE */}
          {isInvestigationDetail && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 2px", fontSize: "18px", fontWeight: 800 }}>Investigation INV-873</h3>
                <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>Almond Oat Energy Bar · Indiranagar Market</span>
              </div>

              {officerActionSaved ? (
                <div
                  style={{
                    padding: 14,
                    border: "1px solid var(--deep-green)",
                    borderRadius: 12,
                    background: "var(--sf-pale)",
                    color: "var(--deep-green)",
                    fontSize: "12px",
                  }}
                >
                  <CheckCircle2 style={{ display: "inline", width: 15, height: 15, marginRight: 6, verticalAlign: "middle" }} />
                  Record saved! Synced with District Legal Metrology Register (Auto-Verified).
                </div>
              ) : null}

              {/* Status Update Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOfficerActionSaved(true);
                }}
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--sf-line)",
                  borderRadius: 16,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
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
                  <label>Field Notes & Observations</label>
                  <textarea
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    required
                    placeholder="Record retailer name, seized batch numbers, or inspection notes..."
                  />
                </div>

                <button type="submit" className="sf-app-scan-btn" style={{ justifyContent: "center" }}>
                  Save Enforcement Record (Auto-Verified) &rarr;
                </button>
              </form>
            </div>
          )}

          {/* SECTION: OFFICER SETTINGS */}
          {activeSection === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>Officer Profile</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--sf-quiet)" }}>
                  Food Safety Enforcement Division credentials.
                </p>
              </div>

              <div
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--sf-line)",
                  borderRadius: 16,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div className="sf-demo-field">
                  <label>Officer Name</label>
                  <input type="text" readOnly value="Inspector Meera Iyer" />
                </div>
                <div className="sf-demo-field">
                  <label>Badge Identifier</label>
                  <input type="text" readOnly value="OFF-DHU-4921" />
                </div>
                <div className="sf-demo-field">
                  <label>District Jurisdiction</label>
                  <input type="text" readOnly value="DHULE / MAHARASHTRA" />
                </div>

                <div className="sf-demo-toggle-line">
                  <div>
                    <strong>Auto-Verification Priority</strong>
                    <div style={{ color: "var(--sf-quiet)", fontSize: "10px" }}>Reports submitted by your badge bypass manual approval.</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>

                <a
                  href="/login"
                  className="sf-app-scan-btn"
                  style={{ background: "color-mix(in oklab, #ef4444 14%, var(--background))", color: "#b91c1c", boxShadow: "none", border: "1px solid #ef4444", marginTop: 8 }}
                >
                  <LogOut style={{ width: 16, height: 16 }} />
                  Sign Out
                </a>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Officer App Navigation Dock */}
        <nav className="sf-app-dock" aria-label="Officer Navigation">
          <div className="sf-app-dock-inner">
            <a
              href={portalHref("officer", "dashboard")}
              className={`sf-app-dock-tab ${activeSection === "dashboard" ? "sf-app-dock-tab-active" : ""}`}
            >
              <Home />
              <span>Feed</span>
            </a>

            {/* Elevated Center Scan Button */}
            <a href={portalHref("officer", "scan")} className="sf-app-dock-scan-btn" title="Audit Scan">
              <ScanLine />
            </a>

            <a
              href={portalHref("officer", "investigations")}
              className={`sf-app-dock-tab ${activeSection.startsWith("investigations") ? "sf-app-dock-tab-active" : ""}`}
            >
              <ClipboardCheck />
              <span>Cases</span>
            </a>

            <a
              href={portalHref("officer", "settings")}
              className={`sf-app-dock-tab ${activeSection === "settings" ? "sf-app-dock-tab-active" : ""}`}
            >
              <User />
              <span>Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. ADMIN CONSOLE VIEW (Regulatory Oversight Console)
   ========================================================================== */

type AdminConsoleProps = {
  activeSection: string;
  switchRole: (r: SafeFoodRole) => void;
  newOfficerName: string;
  setNewOfficerName: (v: string) => void;
  newOfficerDistrict: string;
  setNewOfficerDistrict: (v: string) => void;
  officerAddedMessage: boolean;
  setOfficerAddedMessage: (v: boolean) => void;
};

function AdminConsoleView({
  activeSection,
  switchRole,
  newOfficerName,
  setNewOfficerName,
  newOfficerDistrict,
  setNewOfficerDistrict,
  officerAddedMessage,
  setOfficerAddedMessage,
}: AdminConsoleProps) {
  return (
    <div className="sf-demo sf-demo-app">
      <header className="sf-demo-topbar">
        <div className="sf-demo-topbar-left">
          <a href="/" className="sf-demo-brand" aria-label="SafeFood Home">
            <span className="sf-demo-brand-mark">
              <ShieldCheck />
            </span>
            <span>SafeFood</span>
          </a>
          <span className="sf-demo-divider" />
          <span className="sf-demo-workspace-label">Regulatory & District Oversight Workspace</span>
        </div>

        <div className="sf-demo-topbar-right">
          <div className="sf-demo-user-chip">
            <span className="sf-demo-avatar">PA</span>
            <div>
              <strong>Platform Administrator</strong>
              <div style={{ color: "var(--sf-quiet)", fontSize: "10px" }}>Regulatory Head</div>
            </div>
          </div>

          <a href="/login" className="sf-demo-text-link" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "11px" }}>
            <LogOut style={{ width: 14, height: 14 }} />
            <span>Sign out</span>
          </a>
        </div>
      </header>

      <div className="sf-demo-app-grid">
        <aside className="sf-demo-sidebar">
          <span className="sf-demo-sidebar-heading">ADMINISTRATION</span>
          <nav className="sf-demo-nav-list">
            <a href={portalHref("admin", "dashboard")} className={`sf-demo-nav-link ${activeSection === "dashboard" ? "sf-demo-nav-link-active" : ""}`}>
              <Home />
              <span>Overview</span>
            </a>
            <a href={portalHref("admin", "officers")} className={`sf-demo-nav-link ${activeSection === "officers" ? "sf-demo-nav-link-active" : ""}`}>
              <UserCog />
              <span>Officer Fleet</span>
            </a>
            <a href={portalHref("admin", "users")} className={`sf-demo-nav-link ${activeSection === "users" ? "sf-demo-nav-link-active" : ""}`}>
              <Users />
              <span>Citizens</span>
            </a>
            <a href={portalHref("admin", "complaints")} className={`sf-demo-nav-link ${activeSection === "complaints" ? "sf-demo-nav-link-active" : ""}`}>
              <FileText />
              <span>Grievances Queue</span>
            </a>
            <a href={portalHref("admin", "settings")} className={`sf-demo-nav-link ${activeSection === "settings" ? "sf-demo-nav-link-active" : ""}`}>
              <User />
              <span>Settings</span>
            </a>
          </nav>

          <div className="sf-demo-role-switch">
            <p>SWITCH PERSONA</p>
            <select value="admin" onChange={(e) => switchRole(e.target.value as SafeFoodRole)}>
              <option value="user">📱 Citizen App (Aarav)</option>
              <option value="officer">🛡️ Officer App (Insp. Meera)</option>
              <option value="admin">🏢 Admin Console</option>
            </select>
          </div>
        </aside>

        <main className="sf-demo-workspace">
          {activeSection === "dashboard" && (
            <>
              <div className="sf-demo-stat-grid">
                <div className="sf-demo-stat">
                  <div className="sf-demo-stat-top">
                    <span className="sf-demo-stat-label">STATEWIDE GRIEVANCES</span>
                    <span className="sf-demo-stat-icon"><FileText /></span>
                  </div>
                  <strong>142</strong>
                  <small>Across 9 districts</small>
                </div>
                <div className="sf-demo-stat">
                  <div className="sf-demo-stat-top">
                    <span className="sf-demo-stat-label">ACTIVE FIELD OFFICERS</span>
                    <span className="sf-demo-stat-icon"><UserCog /></span>
                  </div>
                  <strong>34</strong>
                  <small>Enforcement fleet deployed</small>
                </div>
                <div className="sf-demo-stat">
                  <div className="sf-demo-stat-top">
                    <span className="sf-demo-stat-label">VERIFIED VIOLATIONS</span>
                    <span className="sf-demo-stat-icon" style={{ color: "var(--destructive)" }}><AlertTriangle /></span>
                  </div>
                  <strong>89</strong>
                  <small>Notices issued to packers</small>
                </div>
                <div className="sf-demo-stat">
                  <div className="sf-demo-stat-top">
                    <span className="sf-demo-stat-label">RESOLUTION RATE</span>
                    <span className="sf-demo-stat-icon"><CheckCircle2 /></span>
                  </div>
                  <strong>84.2%</strong>
                  <small>Avg turnaround: 3.2 days</small>
                </div>
              </div>

              <div className="sf-demo-dashboard-grid">
                <div className="sf-demo-panel">
                  <div className="sf-demo-panel-head">
                    <h2>Latest District Grievances Feed</h2>
                  </div>
                  <div className="sf-demo-panel-body">
                    <div className="sf-demo-table-wrap">
                      <table className="sf-demo-table">
                        <thead>
                          <tr>
                            <th>IDENTIFIER</th>
                            <th>PRODUCT</th>
                            <th>DISTRICT</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sampleComplaints.map((c) => (
                            <tr key={c.id}>
                              <td>{c.id}</td>
                              <td>{c.product}</td>
                              <td>{c.location}</td>
                              <td><span className="sf-demo-status">{c.status}</span></td>
                              <td><a href={portalHref("admin", "complaints")} className="sf-demo-text-link">Review &rarr;</a></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="sf-demo-panel">
                  <div className="sf-demo-panel-head">
                    <h2>Admin Actions</h2>
                  </div>
                  <div className="sf-demo-panel-body">
                    <div className="sf-demo-quick-actions">
                      <a href={portalHref("admin", "officers")} className="sf-demo-quick-link">
                        <UserCog />
                        <span>Deploy New Field Officer</span>
                      </a>
                      <a href={portalHref("admin", "complaints")} className="sf-demo-quick-link">
                        <FileText />
                        <span>View Statewide Queue</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "officers" && (
            <div className="sf-demo-report-grid">
              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>District Enforcement Officer Fleet</h2>
                </div>
                <div className="sf-demo-panel-body">
                  <div className="sf-demo-table-wrap">
                    <table className="sf-demo-table">
                      <thead>
                        <tr>
                          <th>OFFICER NAME</th>
                          <th>BADGE</th>
                          <th>DISTRICT</th>
                          <th>ACTIVE CASES</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Inspector Meera Iyer</td>
                          <td>OFF-DHU-4921</td>
                          <td>DHULE</td>
                          <td>5</td>
                          <td><span className="sf-demo-status">On Duty</span></td>
                        </tr>
                        <tr>
                          <td>Inspector Rajesh Koli</td>
                          <td>OFF-PUN-1094</td>
                          <td>PUNE</td>
                          <td>8</td>
                          <td><span className="sf-demo-status">On Duty</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>Deploy Field Officer</h2>
                </div>
                <div className="sf-demo-panel-body">
                  {officerAddedMessage && (
                    <div style={{ padding: 10, background: "var(--sf-pale)", border: "1px solid var(--deep-green)", borderRadius: 6, color: "var(--deep-green)", fontSize: "11px", marginBottom: 10 }}>
                      Officer deployed to district {newOfficerDistrict}!
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setOfficerAddedMessage(true);
                      setNewOfficerName("");
                    }}
                  >
                    <div className="sf-demo-form-fields">
                      <div className="sf-demo-field">
                        <label>Officer Name</label>
                        <input
                          type="text"
                          required
                          value={newOfficerName}
                          onChange={(e) => setNewOfficerName(e.target.value)}
                          placeholder="e.g. Inspector Anil Shinde"
                        />
                      </div>
                      <div className="sf-demo-field">
                        <label>Assigned District</label>
                        <select value={newOfficerDistrict} onChange={(e) => setNewOfficerDistrict(e.target.value)}>
                          <option value="DHULE">DHULE</option>
                          <option value="PUNE">PUNE</option>
                          <option value="MUMBAI">MUMBAI</option>
                        </select>
                      </div>
                      <button type="submit" className="sf-demo-primary-action">
                        Deploy Officer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div className="sf-demo-panel">
              <div className="sf-demo-panel-head">
                <h2>Registered Citizens</h2>
              </div>
              <div className="sf-demo-panel-body">
                <div className="sf-demo-table-wrap">
                  <table className="sf-demo-table">
                    <thead>
                      <tr>
                        <th>CITIZEN NAME</th>
                        <th>EMAIL</th>
                        <th>DISTRICT</th>
                        <th>TOTAL SCANS</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Aarav Sharma</td>
                        <td>aarav@safefood.in</td>
                        <td>DHULE</td>
                        <td>28</td>
                        <td><span className="sf-demo-status">Active</span></td>
                      </tr>
                      <tr>
                        <td>Pooja Deshmukh</td>
                        <td>pooja@safefood.in</td>
                        <td>PUNE</td>
                        <td>14</td>
                        <td><span className="sf-demo-status">Active</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "complaints" && (
            <div className="sf-demo-panel">
              <div className="sf-demo-panel-head">
                <h2>Statewide Grievances Queue</h2>
              </div>
              <div className="sf-demo-panel-body">
                <div className="sf-demo-table-wrap">
                  <table className="sf-demo-table">
                    <thead>
                      <tr>
                        <th>GRIEVANCE ID</th>
                        <th>PRODUCT</th>
                        <th>LOCATION</th>
                        <th>STATUS</th>
                        <th>OFFICER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleComplaints.map((c) => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.product}</td>
                          <td>{c.location}</td>
                          <td><span className="sf-demo-status">{c.status}</span></td>
                          <td>{c.officer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="sf-demo-panel" style={{ maxWidth: 600 }}>
              <div className="sf-demo-panel-head">
                <h2>Platform Settings</h2>
              </div>
              <div className="sf-demo-panel-body">
                <div className="sf-demo-form-fields">
                  <div className="sf-demo-field">
                    <label>Platform Name</label>
                    <input type="text" readOnly value="SafeFood Regulatory Compliance Platform" />
                  </div>
                  <div className="sf-demo-field">
                    <label>Legal Framework Reference</label>
                    <input type="text" readOnly value="Legal Metrology Act 2009 & PCR 2011" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
