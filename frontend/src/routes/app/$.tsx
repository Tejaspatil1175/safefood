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
  HelpCircle,
  Award,
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
      { title: "SafeFood — Consumer Food Safety & Legal Metrology Web" },
      { name: "description", content: "SafeFood web platform for verifying packaged food declarations and filing grievances." },
    ],
  }),
  component: AppPortalPage,
});

function AppPortalPage() {
  const { _splat } = Route.useParams();
  const locationInfo = parsePortalLocation(_splat);
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
   1. CITIZEN WEB EXPERIENCE
   Warm organic cream background (#FAF5EA), editorial typography, book finish
   ========================================================================== */

type CitizenWebProps = {
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

function CitizenWebView({
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
}: CitizenWebProps) {
  return (
    <div className="sf-web-root">
      {/* Editorial Web Header */}
      <header className="sf-web-header">
        <div className="sf-web-header-inner">
          <a href="/app/user/dashboard" className="sf-web-brand" aria-label="SafeFood Home">
            <div className="sf-web-seal">
              <ShieldCheck />
            </div>
            <div className="sf-web-brand-text">
              <span className="sf-web-brand-title">SafeFood</span>
              <span className="sf-web-brand-subtitle">Consumer Food Safety & Metrology</span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="sf-web-nav-links" aria-label="Main Navigation">
            <a
              href={portalHref("user", "dashboard")}
              className={`sf-web-nav-link ${activeSection === "dashboard" ? "sf-web-nav-link-active" : ""}`}
            >
              Overview
            </a>
            <a
              href={portalHref("user", "scan")}
              className={`sf-web-nav-link ${activeSection === "scan" ? "sf-web-nav-link-active" : ""}`}
            >
              Scan & Verify
            </a>
            <a
              href={portalHref("user", "history")}
              className={`sf-web-nav-link ${activeSection === "history" ? "sf-web-nav-link-active" : ""}`}
            >
              My Scans
            </a>
            <a
              href={portalHref("user", "complaints")}
              className={`sf-web-nav-link ${activeSection.startsWith("complaints") ? "sf-web-nav-link-active" : ""}`}
            >
              Grievances
            </a>
            <a
              href={portalHref("user", "settings")}
              className={`sf-web-nav-link ${activeSection === "settings" ? "sf-web-nav-link-active" : ""}`}
            >
              Profile
            </a>
          </nav>

          {/* User Controls & Role Switcher */}
          <div className="sf-web-header-right">
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
              <div className="sf-web-user-avatar">AS</div>
              <div className="sf-web-user-meta">
                <strong>Aarav Sharma</strong>
                <span>Dhule, Maharashtra</span>
              </div>
            </div>

            <a href="/login" className="sf-web-signout-btn" title="Sign out">
              <LogOut style={{ width: 15, height: 15 }} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Web Page Content */}
      <main className="sf-web-container">
        {/* SECTION: CITIZEN DASHBOARD (OVERVIEW) */}
        {activeSection === "dashboard" && (
          <>
            {/* Editorial Hero Banner (matching user's reference image) */}
            <section className="sf-web-hero">
              <div>
                <div className="sf-web-hero-kicker">
                  <span className="sf-web-hero-kicker-dot" />
                  Statutory Food Quality & Metrology Protection
                </div>
                <h1 className="sf-web-hero-title">
                  VERIFIED PACKAGED <br />
                  <em>Food Authenticity</em>
                </h1>
                <p className="sf-web-hero-lead">
                  Experience complete peace of mind when buying packaged food. SafeFood uses Gemini AI to verify mandatory declarations, identify illegal microscopic fonts under PCR 2011 Rule 6, and lodge direct statutory grievances to district enforcement officers.
                </p>

                <div className="sf-web-hero-actions">
                  <a href={portalHref("user", "scan")} className="sf-web-pill-btn">
                    <span>Scan Packaging Now</span>
                    <div className="sf-web-pill-arrow">
                      <ArrowRight style={{ width: 16, height: 16 }} />
                    </div>
                  </a>

                  <a href={portalHref("user", "complaints/new")} className="sf-web-pill-secondary">
                    <FilePlus2 style={{ width: 16, height: 16, color: "#D35400" }} />
                    <span>Lodge a Grievance</span>
                  </a>
                </div>
              </div>

              {/* Showcase Card on Right */}
              <div className="sf-web-hero-card">
                <div className="sf-web-hero-card-seal">
                  <Award style={{ width: 26, height: 26 }} />
                </div>

                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 800, color: "#2A5A48" }}>
                  <Sparkles style={{ width: 14, height: 14 }} />
                  AI METROLOGY AUDIT · LIVE SAMPLE
                </div>

                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800, color: "#201E1A" }}>
                    Almond Oat Energy Bar (40 g)
                  </h3>
                  <span style={{ fontSize: "12px", color: "#7A6F5D" }}>
                    Batch B-4029 · Category: Packaged Snack
                  </span>
                </div>

                <div
                  style={{
                    border: "1px dashed #E8DEC8",
                    borderRadius: 12,
                    padding: "12px 14px",
                    background: "#FAF5EA",
                    fontSize: "12px",
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "#C85A32", display: "block", marginBottom: 2 }}>
                    ⚠️ PCR 2011 Rule 6(1)(a) Warning:
                  </strong>
                  Manufacturer / packer address omits district and PIN code. Font height of mandatory declaration is under the statutory 2.0 mm limit.
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 6 }}>
                  <span className="sf-web-badge sf-web-badge-warn">Audit Flagged</span>
                  <a
                    href={portalHref("user", "scan")}
                    style={{ fontSize: "12px", fontWeight: 800, color: "#2A5A48", textDecoration: "none" }}
                  >
                    Inspect Full Audit &rarr;
                  </a>
                </div>
              </div>
            </section>

            {/* Stats Highlights Strip */}
            <div className="sf-web-stats-strip">
              <div className="sf-web-stat-card">
                <span>Total Packages Scanned</span>
                <strong>28</strong>
                <small>Across snacks, dairy, and staples</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Compliant Products</span>
                <strong style={{ color: "#1E6B4A" }}>21</strong>
                <small>Passed PCR 2011 & FSSAI standards</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Violations Flagged</span>
                <strong style={{ color: "#C85A32" }}>7</strong>
                <small>Missing MRP, dates, or address</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Grievances Lodged</span>
                <strong>3</strong>
                <small>1 under investigation, 1 resolved</small>
              </div>
            </div>

            {/* Active Grievance Callout Card */}
            <div
              style={{
                background: "#FFFDF9",
                border: "1.5px solid #E8DEC8",
                borderLeft: "5px solid #D35400",
                borderRadius: 16,
                padding: "18px 24px",
                marginBottom: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                boxShadow: "0 4px 18px rgba(60, 48, 24, 0.04)",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#D35400" }}>
                  Active District Case in Progress
                </span>
                <h4 style={{ margin: "4px 0", fontSize: "17px", fontWeight: 800, color: "#201E1A" }}>
                  Grievance GRV-2048: Almond Oat Energy Bar
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#7A6F5D" }}>
                  Assigned to <strong>Inspector Meera Iyer</strong> (Dhule Division) · Physical retailer inspection completed today
                </p>
              </div>

              <a
                href={portalHref("user", "complaints/GRV-2048")}
                className="sf-web-pill-secondary"
                style={{ borderColor: "#201E1A" }}
              >
                Track Case Timeline &rarr;
              </a>
            </div>

            {/* Recent Product Checks Grid (Editorial Cards) */}
            <section>
              <div className="sf-web-section-head">
                <div>
                  <h3>Recent Packaged Food Checks</h3>
                  <p>Certified audits of food products scanned in your district</p>
                </div>
                <a href={portalHref("user", "history")}>View Complete Archive ({sampleScans.length}) &rarr;</a>
              </div>

              <div className="sf-web-products-grid">
                {sampleScans.map((scan) => (
                  <div key={scan.id} className="sf-web-product-card">
                    <div className="sf-web-product-card-top">
                      <div>
                        <span className="sf-web-product-category">{scan.category}</span>
                        <h4 className="sf-web-product-title">{scan.product}</h4>
                        <div className="sf-web-product-meta">{scan.id} · {scan.date}</div>
                      </div>

                      <span className={`sf-web-badge ${scan.warning ? "sf-web-badge-warn" : "sf-web-badge-ok"}`}>
                        {scan.warning ? "⚠️ Rule 6 Issue" : "✅ Certified Safe"}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: "12px", color: "#5D5445", lineHeight: 1.5 }}>
                      {scan.warning
                        ? "Warning: Incomplete packer address printed without district and PIN code. Font height under 2mm."
                        : "Fully compliant: Clear MRP inclusive of taxes, net weight, expiry date, customer care helpline & 14-digit FSSAI license."}
                    </p>

                    <div className="sf-web-product-actions">
                      <span style={{ fontSize: "11px", color: "#8C8270" }}>Indiranagar Market</span>
                      {scan.warning ? (
                        <a href={portalHref("user", "complaints/new")}>
                          Lodge Grievance &rarr;
                        </a>
                      ) : (
                        <a href={portalHref("user", "scan")}>
                          View Audit Details &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* SECTION: CITIZEN SCAN & VERIFY */}
        {activeSection === "scan" && (
          <div>
            <div className="sf-web-section-head">
              <div>
                <h3>Packaging Label Scanner & Metrology Audit</h3>
                <p>Verify mandatory declarations under Rule 6 of PCR 2011 and FSSAI standards</p>
              </div>
              <a href={portalHref("user", "dashboard")}>&larr; Back to Overview</a>
            </div>

            <div className="sf-web-scanner-layout">
              {/* Left Column: Viewfinder & Product Switcher */}
              <div className="sf-web-card">
                <div className="sf-web-viewfinder">
                  <div className="sf-web-viewfinder-scanline" />
                  <span style={{ fontSize: "11px", color: "#C5A059", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
                    AI Optical Recognition Scanner (4-Angle Compliance)
                  </span>

                  <div className="sf-web-target-box">
                    <ScanLine style={{ width: 52, height: 52, color: "#D35400" }} />
                  </div>

                  <strong style={{ display: "block", fontSize: "18px", color: "#FFFFFF", marginTop: 8 }}>
                    {scanItem.product}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#C5A059" }}>
                    Category: {scanItem.category} · Barcode: 8901234567890 · Scan ID: {scanItem.id}
                  </span>
                </div>

                {/* Sample Product Selection Pills */}
                <div style={{ marginTop: 20 }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#7A6F5D", display: "block", marginBottom: 8 }}>
                    Test Different Sample Products:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {sampleScans.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedScanItem(s)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 20,
                          border: `1.5px solid ${scanItem.id === s.id ? "#201E1A" : "#E8DEC8"}`,
                          background: scanItem.id === s.id ? "#201E1A" : "#FFFDF9",
                          color: scanItem.id === s.id ? "#FFFFFF" : "#201E1A",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {s.warning ? "⚠️ " : "✅ "}
                        {s.product}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Statutory Audit & Declarations Checklist */}
              <div className="sf-web-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 800 }}>
                    Statutory Rule 6 Declaration Checklist
                  </h4>
                  <span className={`sf-web-badge ${scanItem.warning ? "sf-web-badge-warn" : "sf-web-badge-ok"}`}>
                    {scanItem.warning ? "Audit Failed" : "All Declarations Passed"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                  {mandatoryDeclarations.map((decl, index) => {
                    const isFailedItem = scanItem.warning && index === 3;
                    const isOk = !isFailedItem && decl.ok;

                    return (
                      <div
                        key={decl.label}
                        className={`sf-web-checklist-item ${!isOk ? "sf-web-checklist-item-warn" : ""}`}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {isOk ? (
                            <CheckCircle2 style={{ width: 18, height: 18, color: "#1E6B4A", flexShrink: 0 }} />
                          ) : (
                            <X style={{ width: 18, height: 18, color: "#C85A32", flexShrink: 0 }} />
                          )}
                          <div>
                            <strong style={{ fontSize: "13px", color: "#201E1A", display: "block" }}>
                              {decl.label}
                            </strong>
                            <span style={{ fontSize: "11px", color: "#7A6F5D" }}>
                              {isFailedItem ? "BREACH: Incomplete address. Omits district & PIN code." : decl.detail}
                            </span>
                          </div>
                        </div>

                        <span className={`sf-web-badge ${isOk ? "sf-web-badge-ok" : "sf-web-badge-warn"}`}>
                          {isOk ? "PASS" : "FAIL"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Gemini AI Regulatory Audit Note */}
                <div
                  style={{
                    background: "#FAF5EA",
                    border: "1px solid #E8DEC8",
                    borderRadius: 14,
                    padding: "16px",
                    fontSize: "12px",
                    lineHeight: 1.6,
                    color: "#5D5445",
                    marginBottom: 20,
                  }}
                >
                  <strong style={{ color: "#201E1A", display: "block", marginBottom: 4 }}>
                    <Sparkles style={{ width: 14, height: 14, display: "inline", verticalAlign: "middle", marginRight: 5, color: "#D35400" }} />
                    Gemini AI Statutory Legal Findings:
                  </strong>
                  {scanItem.warning
                    ? "Under Section 36 of the Legal Metrology Act, 2009 and PCR 2011 Rule 6(1)(a), manufacturing or distributing food without the complete name and address of the packer is an offense punishable with fine and seizure."
                    : "Package satisfies all mandatory disclosures under PCR 2011 and FSSAI Packaging Regulations. MRP and Net Quantity are clearly visible with font height exceeding 2.0 mm."}
                </div>

                {scanItem.warning && (
                  <a href={portalHref("user", "complaints/new")} className="sf-web-pill-btn" style={{ width: "100%", justifyContent: "center" }}>
                    <span>Lodge Official Grievance with this Scan</span>
                    <div className="sf-web-pill-arrow">
                      <ArrowRight style={{ width: 16, height: 16 }} />
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: CITIZEN HISTORY */}
        {activeSection === "history" && (
          <div>
            <div className="sf-web-section-head">
              <div>
                <h3>My Inspection & Scan Archive</h3>
                <p>Complete historical log of all food packages audited by your account</p>
              </div>
              <a href={portalHref("user", "scan")}>+ Scan New Product &rarr;</a>
            </div>

            <div className="sf-web-products-grid">
              {sampleScans.map((scan) => (
                <div key={scan.id} className="sf-web-product-card">
                  <div className="sf-web-product-card-top">
                    <div>
                      <span className="sf-web-product-category">{scan.category}</span>
                      <h4 className="sf-web-product-title">{scan.product}</h4>
                      <div className="sf-web-product-meta">{scan.id} · {scan.date}</div>
                    </div>

                    <span className={`sf-web-badge ${scan.warning ? "sf-web-badge-warn" : "sf-web-badge-ok"}`}>
                      {scan.warning ? "⚠️ Issue Flagged" : "✅ Compliant"}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: "12px", color: "#5D5445", lineHeight: 1.5 }}>
                    {scan.warning
                      ? "Flagged for missing complete packer address details. In violation of Legal Metrology Rule 6."
                      : "Verified compliant with FSSAI regulations and Legal Metrology Act standards."}
                  </p>

                  <div className="sf-web-product-actions">
                    <a href={portalHref("user", "scan")}>Open Audit Details &rarr;</a>
                    {scan.warning && (
                      <a href={portalHref("user", "complaints/new")} style={{ color: "#C85A32" }}>
                        File Grievance &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: CITIZEN GRIEVANCES */}
        {activeSection === "complaints" && !isComplaintCreate && !isComplaintDetail && (
          <div>
            <div className="sf-web-section-head">
              <div>
                <h3>My Lodged Consumer Grievances</h3>
                <p>Legal Metrology (PCR 2011) complaints assigned to District Food Safety Officers</p>
              </div>
              <a href={portalHref("user", "complaints/new")}>+ Lodge New Grievance &rarr;</a>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {sampleComplaints.map((c) => (
                <div key={c.id} className="sf-web-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#D35400" }}>{c.id}</span>
                    <h4 style={{ margin: "3px 0", fontSize: "18px", fontWeight: 800, color: "#201E1A" }}>{c.product}</h4>
                    <span style={{ fontSize: "12px", color: "#7A6F5D" }}>{c.location} · Filed on {c.date}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "11px", color: "#7A6F5D", display: "block" }}>Assigned Officer</span>
                      <strong style={{ fontSize: "13px", color: "#201E1A" }}>{c.officer}</strong>
                    </div>

                    <span className={`sf-web-badge ${c.status === "Resolved" ? "sf-web-badge-ok" : "sf-web-badge-warn"}`}>
                      {c.status}
                    </span>

                    <a href={portalHref("user", `complaints/${c.id}`)} className="sf-web-pill-secondary">
                      View Timeline &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-SECTION: CREATE COMPLAINT */}
        {isComplaintCreate && (
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div className="sf-web-section-head">
              <div>
                <h3>Lodge a Legal Metrology (PCR 2011) Grievance</h3>
                <p>Report misleading food labels or missing mandatory declarations to the District Officer</p>
              </div>
              <a href={portalHref("user", "complaints")}>&larr; Cancel</a>
            </div>

            {complaintSubmitted ? (
              <div className="sf-web-card" style={{ textAlign: "center", padding: "48px 24px" }}>
                <CheckCircle2 style={{ width: 56, height: 56, color: "#1E6B4A", margin: "0 auto 16px" }} />
                <h3 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 800 }}>Grievance Successfully Lodged</h3>
                <p style={{ color: "#5D5445", fontSize: "14px", maxWidth: 460, margin: "0 auto 24px" }}>
                  Your grievance has been assigned Tracking ID <strong>GRV-2051</strong> and routed to the Food Safety Enforcement Officer in <strong>{newComplaintDistrict}</strong>.
                </p>
                <a href={portalHref("user", "complaints")} className="sf-web-pill-btn">
                  <span>View in Grievance Queue</span>
                  <div className="sf-web-pill-arrow">
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </div>
                </a>
              </div>
            ) : (
              <form
                className="sf-web-card"
                onSubmit={(e) => {
                  e.preventDefault();
                  setComplaintSubmitted(true);
                }}
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <div className="sf-demo-field">
                  <label>Detected Non-Compliant Product</label>
                  <input type="text" readOnly value="Almond Oat Energy Bar (Batch B-4029) — Incomplete Packer Address" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
                    <label>Store / Purchase Location</label>
                    <input type="text" required placeholder="e.g. Reliance Fresh, Station Road" />
                  </div>
                </div>

                <div className="sf-demo-field">
                  <label>Consumer Grievance Statement</label>
                  <textarea
                    value={newComplaintNote}
                    onChange={(e) => setNewComplaintNote(e.target.value)}
                    required
                    placeholder="Describe the label issue (e.g. packer address was missing, MRP printed in microscopic font under 2mm)..."
                  />
                </div>

                <div style={{ background: "#FAF5EA", border: "1px dashed #E8DEC8", borderRadius: 12, padding: 14, fontSize: "12px", color: "#7A6F5D" }}>
                  📸 High-resolution front and nutritional table scan evidence automatically attached from your AI inspection.
                </div>

                <button type="submit" className="sf-web-pill-btn" style={{ alignSelf: "flex-start" }}>
                  <span>Submit Grievance to District Officer</span>
                  <div className="sf-web-pill-arrow">
                    <Send style={{ width: 16, height: 16 }} />
                  </div>
                </button>
              </form>
            )}
          </div>
        )}

        {/* SUB-SECTION: COMPLAINT DETAIL & TIMELINE */}
        {isComplaintDetail && (
          <div style={{ maxWidth: 840, margin: "0 auto" }}>
            <div className="sf-web-section-head">
              <div>
                <h3>Grievance Case GRV-2048: Almond Oat Energy Bar</h3>
                <p>Official Statutory Timeline & District Action Records</p>
              </div>
              <a href={portalHref("user", "complaints")}>&larr; Back to Grievances</a>
            </div>

            <div className="sf-web-card" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, paddingBottom: 18, borderBottom: "1px solid #E8DEC8" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#7A6F5D", display: "block" }}>Location</span>
                  <strong style={{ fontSize: "13px" }}>Indiranagar Market, Bengaluru</strong>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#7A6F5D", display: "block" }}>Assigned Officer</span>
                  <strong style={{ fontSize: "13px" }}>Inspector Meera Iyer (OFF-BLR-892)</strong>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#7A6F5D", display: "block" }}>Current Status</span>
                  <span className="sf-web-badge sf-web-badge-warn">Under Investigation</span>
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800 }}>Statutory Investigation Timeline</h4>
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
                      <strong>3. Physical Retail Inspection Conducted</strong>
                      <small>Oct 12, 2026 at 11:30 am · Status: UNDER_INVESTIGATION</small>
                    </div>
                  </div>
                  <div className="sf-demo-timeline-step">
                    <span className="sf-demo-timeline-mark" style={{ background: "#FAF5EA", border: "1px solid #E8DEC8", color: "#7A6F5D" }}>4</span>
                    <div>
                      <strong>4. Statutory Notice Issued to Manufacturer</strong>
                      <small>Pending formal explanation under Section 36 of Legal Metrology Act</small>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button
                  type="button"
                  className="sf-web-pill-secondary"
                  onClick={() => alert("Downloading official statutory complaint PDF.")}
                >
                  <Download style={{ width: 16, height: 16 }} />
                  Download PDF Grievance Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: CITIZEN SETTINGS / PROFILE */}
        {activeSection === "settings" && (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="sf-web-section-head">
              <div>
                <h3>Account & Notification Preferences</h3>
                <p>Manage your consumer profile and district notification settings</p>
              </div>
              <a href={portalHref("user", "dashboard")}>&larr; Back</a>
            </div>

            <div className="sf-web-card" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="sf-demo-field">
                <label>Citizen Full Name</label>
                <input type="text" readOnly value="Aarav Sharma" />
              </div>

              <div className="sf-demo-field">
                <label>Registered Email Address</label>
                <input type="text" readOnly value="aarav@safefood.in" />
              </div>

              <div className="sf-demo-field">
                <label>District Jurisdiction</label>
                <input type="text" readOnly value="DHULE / MAHARASHTRA" />
              </div>

              <div className="sf-demo-toggle-line">
                <div>
                  <strong>Legal Metrology PCR 2011 Automated Alerts</strong>
                  <div style={{ color: "#7A6F5D", fontSize: "11px" }}>Receive alerts when non-compliant products are recalled in your district.</div>
                </div>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="sf-demo-toggle-line">
                <div>
                  <strong>Grievance Resolution Updates</strong>
                  <div style={{ color: "#7A6F5D", fontSize: "11px" }}>Instant email and SMS updates when an enforcement officer inspects your complaint.</div>
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
        )}
      </main>
    </div>
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
  return (
    <div className="sf-web-root">
      {/* Officer Header */}
      <header className="sf-web-header">
        <div className="sf-web-header-inner">
          <a href="/app/officer/dashboard" className="sf-web-brand" aria-label="SafeFood Officer">
            <div className="sf-web-seal" style={{ borderColor: "#2A5A48" }}>
              <ShieldCheck />
            </div>
            <div className="sf-web-brand-text">
              <span className="sf-web-brand-title">SafeFood Enforcement</span>
              <span className="sf-web-brand-subtitle">Food Safety Enforcement Division</span>
            </div>
          </a>

          <nav className="sf-web-nav-links" aria-label="Officer Navigation">
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
              Officer Profile
            </a>
          </nav>

          <div className="sf-web-header-right">
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
              <LogOut style={{ width: 15, height: 15 }} />
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
                <strong>48</strong>
                <small>In assigned district (Dhule)</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Statutory Violations</span>
                <strong style={{ color: "#C85A32" }}>16</strong>
                <small>PCR Rule 6 breaches recorded</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Assigned Cases</span>
                <strong style={{ color: "#D35400" }}>5</strong>
                <small>3 pending physical visits</small>
              </div>
              <div className="sf-web-stat-card">
                <span>Auto-Verified Reports</span>
                <strong style={{ color: "#1E6B4A" }}>12</strong>
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
          <div>
            <div className="sf-web-section-head">
              <div>
                <h3>Field Inspection Label OCR Audit</h3>
                <p>Perform on-site packaging verification under Legal Metrology Act, 2009</p>
              </div>
              <a href={portalHref("officer", "dashboard")}>&larr; Back to Dashboard</a>
            </div>

            <div className="sf-web-scanner-layout">
              <div className="sf-web-card">
                <div className="sf-web-viewfinder">
                  <div className="sf-web-viewfinder-scanline" />
                  <span style={{ fontSize: "11px", color: "#C5A059", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
                    FIELD OCR CAMERA (OFFICER CALIBRATED)
                  </span>

                  <div className="sf-web-target-box">
                    <ScanLine style={{ width: 52, height: 52, color: "#D35400" }} />
                  </div>

                  <strong style={{ display: "block", fontSize: "18px", color: "#FFFFFF", marginTop: 8 }}>
                    {scanItem.product}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#C5A059" }}>
                    Category: {scanItem.category} · Barcode: 8901234567890 · Scan ID: {scanItem.id}
                  </span>
                </div>

                <div style={{ marginTop: 20 }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#7A6F5D", display: "block", marginBottom: 8 }}>
                    Select Sample Product:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {sampleScans.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedScanItem(s)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 20,
                          border: `1.5px solid ${scanItem.id === s.id ? "#201E1A" : "#E8DEC8"}`,
                          background: scanItem.id === s.id ? "#201E1A" : "#FFFDF9",
                          color: scanItem.id === s.id ? "#FFFFFF" : "#201E1A",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {s.warning ? "⚠️ " : "✅ "}
                        {s.product}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sf-web-card">
                <h4 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: 800 }}>
                  Statutory Rule 6 Declaration Checklist
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                  {mandatoryDeclarations.map((decl, index) => {
                    const isFailedItem = scanItem.warning && index === 3;
                    const isOk = !isFailedItem && decl.ok;

                    return (
                      <div
                        key={decl.label}
                        className={`sf-web-checklist-item ${!isOk ? "sf-web-checklist-item-warn" : ""}`}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {isOk ? (
                            <CheckCircle2 style={{ width: 18, height: 18, color: "#1E6B4A" }} />
                          ) : (
                            <X style={{ width: 18, height: 18, color: "#C85A32" }} />
                          )}
                          <div>
                            <strong style={{ fontSize: "13px", color: "#201E1A", display: "block" }}>{decl.label}</strong>
                            <span style={{ fontSize: "11px", color: "#7A6F5D" }}>
                              {isFailedItem ? "BREACH: Missing packer address district and PIN code." : decl.detail}
                            </span>
                          </div>
                        </div>

                        <span className={`sf-web-badge ${isOk ? "sf-web-badge-ok" : "sf-web-badge-warn"}`}>
                          {isOk ? "COMPLIANT" : "VIOLATION"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {scanItem.warning && (
                    <button
                      type="button"
                      className="sf-web-pill-btn"
                      style={{ width: "100%", justifyContent: "center", background: "#C85A32" }}
                      onClick={() => alert("Statutory violation notice logged in district register (Auto-Verified).")}
                    >
                      <span>Log Official Enforcement Report (Auto-Verified)</span>
                      <div className="sf-web-pill-arrow" style={{ background: "#201E1A" }}>
                        <ArrowRight style={{ width: 15, height: 15 }} />
                      </div>
                    </button>
                  )}

                  <button
                    type="button"
                    className="sf-web-pill-secondary"
                    style={{ justifyContent: "center" }}
                    onClick={() => alert("Drafting Statutory Notice under Section 36 of Legal Metrology Act, 2009.")}
                  >
                    Draft Statutory Notice under Sec 36 &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                onSubmit={(e) => {
                  e.preventDefault();
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
  return (
    <div className="sf-web-root">
      <header className="sf-web-header">
        <div className="sf-web-header-inner">
          <a href="/app/admin/dashboard" className="sf-web-brand" aria-label="SafeFood Admin">
            <div className="sf-web-seal" style={{ borderColor: "#D35400" }}>
              <ShieldCheck />
            </div>
            <div className="sf-web-brand-text">
              <span className="sf-web-brand-title">SafeFood Oversight</span>
              <span className="sf-web-brand-subtitle">State Regulatory Administration</span>
            </div>
          </a>

          <nav className="sf-web-nav-links" aria-label="Admin Navigation">
            <a
              href={portalHref("admin", "dashboard")}
              className={`sf-web-nav-link ${activeSection === "dashboard" ? "sf-web-nav-link-active" : ""}`}
            >
              Overview
            </a>
            <a
              href={portalHref("admin", "officers")}
              className={`sf-web-nav-link ${activeSection === "officers" ? "sf-web-nav-link-active" : ""}`}
            >
              Officer Fleet
            </a>
            <a
              href={portalHref("admin", "users")}
              className={`sf-web-nav-link ${activeSection === "users" ? "sf-web-nav-link-active" : ""}`}
            >
              Citizens
            </a>
            <a
              href={portalHref("admin", "complaints")}
              className={`sf-web-nav-link ${activeSection === "complaints" ? "sf-web-nav-link-active" : ""}`}
            >
              All Grievances
            </a>
          </nav>

          <div className="sf-web-header-right">
            <select
              className="sf-web-role-picker"
              value="admin"
              onChange={(e) => switchRole(e.target.value as SafeFoodRole)}
              aria-label="Switch persona"
            >
              <option value="user">🌿 Citizen View</option>
              <option value="officer">🛡️ Officer Inspection</option>
              <option value="admin">🏢 Regulatory Oversight</option>
            </select>

            <a href="/login" className="sf-web-signout-btn" title="Sign out">
              <LogOut style={{ width: 15, height: 15 }} />
            </a>
          </div>
        </div>
      </header>

      <main className="sf-web-container" style={{ paddingTop: 32 }}>
        <div className="sf-web-stats-strip">
          <div className="sf-web-stat-card">
            <span>Statewide Grievances</span>
            <strong>142</strong>
            <small>Across 9 administrative districts</small>
          </div>
          <div className="sf-web-stat-card">
            <span>Active Field Officers</span>
            <strong style={{ color: "#2A5A48" }}>34</strong>
            <small>Enforcement fleet deployed</small>
          </div>
          <div className="sf-web-stat-card">
            <span>Verified Violations</span>
            <strong style={{ color: "#C85A32" }}>89</strong>
            <small>Legal notices issued to packers</small>
          </div>
          <div className="sf-web-stat-card">
            <span>Resolution Rate</span>
            <strong style={{ color: "#1E6B4A" }}>84.2%</strong>
            <small>Average turnaround: 3.2 days</small>
          </div>
        </div>

        {activeSection === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
            <div className="sf-web-card">
              <h4 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 800 }}>Recent Grievance Feed</h4>
              <div style={{ display: "grid", gap: 12 }}>
                {sampleComplaints.map((c) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #E8DEC8" }}>
                    <div>
                      <strong style={{ fontSize: "14px", display: "block" }}>{c.product}</strong>
                      <span style={{ fontSize: "12px", color: "#7A6F5D" }}>{c.location} · {c.date}</span>
                    </div>
                    <span className="sf-web-badge sf-web-badge-warn">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sf-web-card">
              <h4 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 800 }}>Deploy Field Officer</h4>
              {officerAddedMessage && (
                <div style={{ background: "#EBF5F0", border: "1px solid #C4E2D3", borderRadius: 10, padding: 12, color: "#1E6B4A", fontSize: "12px", marginBottom: 14 }}>
                  Officer deployed to district {newOfficerDistrict}!
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOfficerAddedMessage(true);
                  setNewOfficerName("");
                }}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div className="sf-demo-field">
                  <label>Officer Full Name</label>
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
                <button type="submit" className="sf-web-pill-btn">
                  <span>Deploy Officer</span>
                  <div className="sf-web-pill-arrow">
                    <ArrowRight style={{ width: 15, height: 15 }} />
                  </div>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
