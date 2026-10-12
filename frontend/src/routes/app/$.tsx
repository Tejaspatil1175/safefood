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
      {/* Editorial Web Header with Symmetric Centered-Logo Layout */}
      <header className="sf-web-header">
        <div className="sf-web-header-inner">
          {/* Left Navigation Links */}
          <nav className="sf-web-nav-links" aria-label="Left Navigation">
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
          </nav>

          {/* Center Brand Seal Emblem */}
          <a href="/app/user/dashboard" className="sf-web-brand" aria-label="SafeFood Home">
            <div className="sf-web-seal">
              <ShieldCheck />
            </div>
            <div className="sf-web-brand-text">
              <span className="sf-web-brand-title">SafeFood</span>
              <span className="sf-web-brand-subtitle">Statutory Food Safety</span>
            </div>
          </a>

          {/* Right Navigation & User Controls */}
          <div className="sf-web-header-right">
            <nav className="sf-web-nav-links" aria-label="Right Navigation">
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
                <span>Dhule, MH</span>
              </div>
            </div>

            <a href="/login" className="sf-web-signout-btn" title="Sign out">
              <LogOut style={{ width: 14, height: 14 }} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Web Page Content */}
      <main className="sf-web-container">
        {/* SECTION: CITIZEN DASHBOARD (OVERVIEW) */}
        {activeSection === "dashboard" && (
          <>
            {/* Centered Editorial Hero Section (matching user's reference image) */}
            <section className="sf-web-hero-centered">
              <div className="sf-web-hero-tagline-float">
                Indulge in certified safe,
                <em>100% Genuine Foods</em>
              </div>

              <div className="sf-web-hero-kicker" style={{ justifyContent: "center" }}>
                <span className="sf-web-hero-kicker-dot" />
                Statutory Consumer Protection · Legal Metrology Act 2009
              </div>

              <h1 className="sf-web-hero-title">
                STATUTORY <br />
                FOOD SAFETY <em>Pure & Verified</em>
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
            </section>

            {/* Featured Sample Inspection Banner */}
            <div
              style={{
                width: "100%",
                maxWidth: 1040,
                margin: "0 auto 36px",
                background: "#FFFDF9",
                border: "1px solid #E8DEC8",
                borderRadius: 20,
                padding: "18px 24px",
                boxShadow: "0 6px 24px rgba(60, 48, 24, 0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FAF5EA", border: "1.5px dashed #C5A059", display: "grid", placeItems: "center", color: "#D35400", flexShrink: 0 }}>
                  <AlertTriangle style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 800, color: "#C85A32", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    AI METROLOGY AUDIT · LIVE SAMPLE VERDICT
                  </div>
                  <h4 style={{ margin: "2px 0", fontSize: "16px", fontWeight: 800, color: "#201E1A" }}>
                    Almond Oat Energy Bar (Batch B-4029)
                  </h4>
                  <span style={{ fontSize: "12px", color: "#7A6F5D" }}>
                    Breach: Incomplete packer address without district or PIN. Font height under statutory 2.0 mm limit.
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="sf-web-badge sf-web-badge-warn">Rule 6 Breach</span>
                <a href={portalHref("user", "scan")} className="sf-web-pill-secondary">
                  Inspect Full Audit &rarr;
                </a>
              </div>
            </div>

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
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Monthly");

  return (
    <div className="sf-admin-root">
      {/* 1. TOP NAVBAR (Matching Ecomora Reference Screenshot) */}
      <header className="sf-admin-navbar">
        <div className="sf-admin-navbar-inner">
          {/* Logo */}
          <a href="/app/admin/dashboard" className="sf-admin-brand">
            <div className="sf-admin-brand-icon">
              <ShieldCheck style={{ width: 20, height: 20 }} />
            </div>
            <span>SafeFood</span>
          </a>

          {/* Navigation Tabs with Active Indicator */}
          <nav className="sf-admin-tabs" aria-label="Admin Navigation Tabs">
            <a
              href={portalHref("admin", "dashboard")}
              className={`sf-admin-tab ${activeSection === "dashboard" ? "sf-admin-tab-active" : ""}`}
            >
              <LayoutDashboard style={{ width: 16, height: 16 }} />
              <span>Dashboard</span>
            </a>
            <a
              href={portalHref("admin", "products")}
              className={`sf-admin-tab ${activeSection === "products" ? "sf-admin-tab-active" : ""}`}
            >
              <Package style={{ width: 16, height: 16 }} />
              <span>Products</span>
            </a>
            <a
              href={portalHref("admin", "complaints")}
              className={`sf-admin-tab ${activeSection === "complaints" ? "sf-admin-tab-active" : ""}`}
            >
              <ClipboardList style={{ width: 16, height: 16 }} />
              <span>Purchases</span>
            </a>
            <a
              href={portalHref("admin", "officers")}
              className={`sf-admin-tab ${activeSection === "officers" ? "sf-admin-tab-active" : ""}`}
            >
              <Users style={{ width: 16, height: 16 }} />
              <span>Customers</span>
            </a>
            <a
              href={portalHref("admin", "analytics")}
              className={`sf-admin-tab ${activeSection === "analytics" ? "sf-admin-tab-active" : ""}`}
            >
              <BarChart3 style={{ width: 16, height: 16 }} />
              <span>Analytics</span>
            </a>
            <a
              href={portalHref("admin", "settings")}
              className={`sf-admin-tab ${activeSection === "settings" ? "sf-admin-tab-active" : ""}`}
            >
              <SettingsIcon style={{ width: 16, height: 16 }} />
              <span>Settings</span>
            </a>
          </nav>

          {/* Right Profile & Persona Controls */}
          <div className="sf-admin-nav-right">
            <select
              className="sf-admin-role-select"
              value="admin"
              onChange={(e) => switchRole(e.target.value as SafeFoodRole)}
              aria-label="Switch persona"
            >
              <option value="user">🌿 Citizen View</option>
              <option value="officer">🛡️ Officer Inspection</option>
              <option value="admin">🏢 Regulatory Admin</option>
            </select>

            <div className="sf-admin-user-profile">
              <div className="sf-admin-user-avatar">AD</div>
              <span>Andriano Darwin</span>
              <ChevronDown style={{ width: 14, height: 14, color: "#64748B" }} />
            </div>

            <a href="/login" className="sf-admin-btn-outline" style={{ padding: "6px 12px" }} title="Sign out">
              <LogOut style={{ width: 14, height: 14 }} />
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN ADMIN CANVAS */}
      <main style={{ maxWidth: 1600, margin: "0 auto", padding: "0 32px 48px" }}>
        {/* SUBHEADER BAR */}
        <div className="sf-admin-subhead">
          <h1>
            {activeSection === "dashboard" && "Dashboard"}
            {activeSection === "products" && "Product Compliance Catalog"}
            {activeSection === "complaints" && "Purchases & Grievances"}
            {activeSection === "officers" && "Officer Fleet & Field Oversight"}
            {activeSection === "users" && "Customer Accounts & Citizens"}
            {activeSection === "analytics" && "Statewide Food Safety Analytics"}
            {activeSection === "settings" && "Regulatory Settings"}
          </h1>

          <div className="sf-admin-subhead-actions">
            <div className="sf-admin-search-box">
              <Search style={{ width: 16, height: 16 }} />
              <input
                type="text"
                placeholder="Search product..."
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="sf-admin-btn-outline"
              onClick={() => alert("Exporting CSV report for active dataset...")}
            >
              <Upload style={{ width: 14, height: 14 }} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="sf-admin-btn-outline"
              onClick={() => alert("Downloading Statewide Compliance Summary Report (PDF)...")}
            >
              <Download style={{ width: 14, height: 14 }} />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* 3. DASHBOARD MAIN VIEW (Exact match to reference image) */}
        {activeSection === "dashboard" && (
          <>
            {/* TOP 3 COLUMNS GRID */}
            <div className="sf-admin-top-grid">
              {/* COL 1: STACKED STAT CARDS */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Stat 1 */}
                <div className="sf-admin-stat-card">
                  <div className="sf-admin-stat-top">
                    <span className="sf-admin-stat-title">Total Products Sales</span>
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
                    <span>View Sales Details</span>
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </a>
                </div>

                {/* Stat 2 */}
                <div className="sf-admin-stat-card">
                  <div className="sf-admin-stat-top">
                    <span className="sf-admin-stat-title">Total Volume Of Products</span>
                    <div className="sf-admin-stat-icon-wrap">
                      <Store style={{ width: 18, height: 18 }} />
                    </div>
                  </div>
                  <div className="sf-admin-stat-value-row">
                    <span className="sf-admin-stat-value">123,726</span>
                    <span className="sf-admin-badge-pill sf-admin-badge-pill-red">
                      -12%
                    </span>
                  </div>
                  <a href={portalHref("admin", "complaints")} className="sf-admin-stat-link">
                    <span>View All Products</span>
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </a>
                </div>
              </div>

              {/* COL 2: BAR CHART CARD (Hatched stripes & solid bars) */}
              <div className="sf-admin-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <span className="sf-admin-stat-title">Total Products Sales</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                      <span className="sf-admin-stat-value">$500,324</span>
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
                    <span>Total Revenue</span>
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
                    <span>Total Profit</span>
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
                    Total Sales Statistics
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
                      {/* Segment 1: Light Grey (Furniture) */}
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
                      {/* Segment 2: Medium Grey (Electronics) */}
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
                      {/* Segment 3: Deep Slate (Clothes) */}
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
                      {/* Segment 4: Solid Black (Shoes) */}
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
                        <span>Furniture</span>
                      </div>
                      <span className="sf-admin-donut-legend-val">89,532</span>
                    </div>

                    <div className="sf-admin-donut-legend-item" style={{ alignItems: "flex-end" }}>
                      <div className="sf-admin-donut-legend-label">
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0F172A" }} />
                        <span>Shoes</span>
                      </div>
                      <span className="sf-admin-donut-legend-val">1,88,500</span>
                    </div>

                    <div className="sf-admin-donut-legend-item">
                      <div className="sf-admin-donut-legend-label">
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#94A3B8" }} />
                        <span>Electronics</span>
                      </div>
                      <span className="sf-admin-donut-legend-val">90,231</span>
                    </div>

                    <div className="sf-admin-donut-legend-item" style={{ alignItems: "flex-end" }}>
                      <div className="sf-admin-donut-legend-label">
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#334155" }} />
                        <span>Clothes</span>
                      </div>
                      <span className="sf-admin-donut-legend-val">88,865</span>
                    </div>
                  </div>

                  <div className="sf-admin-donut-total" style={{ width: "100%" }}>
                    <span>Total Number of Sales</span>
                    <strong>3,44,031</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM 2 COLUMNS GRID */}
            <div className="sf-admin-bottom-grid">
              {/* COL 1: RECENT ORDERS TABLE */}
              <div className="sf-admin-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                      Recant Orders
                    </h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                      Keep track of recant order data and others information.
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
                        <th>Order Id</th>
                        <th>Product Name</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600, color: "#0F172A" }}>#202523</td>
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
                              🎧
                            </div>
                            <span style={{ fontWeight: 600 }}>Airpods Pro Max</span>
                          </div>
                        </td>
                        <td>28 Mar 2025</td>
                        <td>Mastercard</td>
                        <td style={{ fontWeight: 700, color: "#0F172A" }}>$1,230.00</td>
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
                        <td style={{ fontWeight: 600, color: "#0F172A" }}>#202522</td>
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
                              👗
                            </div>
                            <span style={{ fontWeight: 600 }}>Summer Clothes</span>
                          </div>
                        </td>
                        <td>27 Mar 2025</td>
                        <td>Paypal</td>
                        <td style={{ fontWeight: 700, color: "#0F172A" }}>$3,112.00</td>
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
                        <td style={{ fontWeight: 600, color: "#0F172A" }}>#202521</td>
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
                              👟
                            </div>
                            <span style={{ fontWeight: 600 }}>Nike Shoes</span>
                          </div>
                        </td>
                        <td>26 Mar 2025</td>
                        <td>Mastercard</td>
                        <td style={{ fontWeight: 700, color: "#0F172A" }}>$1,211.00</td>
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
                        <td style={{ fontWeight: 600, color: "#0F172A" }}>#202520</td>
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
                              🪑
                            </div>
                            <span style={{ fontWeight: 600 }}>Front Table CSS</span>
                          </div>
                        </td>
                        <td>25 Mar 2025</td>
                        <td>Visa</td>
                        <td style={{ fontWeight: 700, color: "#0F172A" }}>$42,121.00</td>
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
                    </tbody>
                  </table>
                </div>
              </div>

              {/* COL 2: TOP SELLING PRODUCTS & MINI BARS */}
              <div className="sf-admin-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                    Top Selling Products
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
                      ⌚
                    </div>
                    <div className="sf-admin-product-meta">
                      <h5>Apple Watch Series 10 46mm GPS</h5>
                      <p>Brand Apple · 10.2k Stock Available</p>
                      <div className="sf-price">$799.00</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#0F172A" }} />
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1" }} />
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1" }} />
                  </div>
                </div>

                {/* Mini Bars Chart */}
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
                  <tr>
                    <td>#OFF-901</td>
                    <td><strong>Insp. Rajesh Patil</strong></td>
                    <td>Dhule Urban</td>
                    <td>14</td>
                    <td><span className="sf-admin-status-chip sf-admin-status-complete">Active On-Duty</span></td>
                  </tr>
                  <tr>
                    <td>#OFF-902</td>
                    <td><strong>Insp. Sneha Deshmukh</strong></td>
                    <td>Pune Central</td>
                    <td>9</td>
                    <td><span className="sf-admin-status-chip sf-admin-status-complete">Active On-Duty</span></td>
                  </tr>
                  <tr>
                    <td>#OFF-903</td>
                    <td><strong>Insp. Amit Kulkarni</strong></td>
                    <td>Mumbai Metro</td>
                    <td>22</td>
                    <td><span className="sf-admin-status-chip sf-admin-status-waiting">In Transit</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="sf-admin-card">
              <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                Deploy Field Officer
              </h3>
              {officerAddedMessage && (
                <div style={{ background: "#DCFCE7", border: "1px solid #BBF7D0", borderRadius: 10, padding: 12, color: "#15803D", fontSize: 13, marginBottom: 14 }}>
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
                {sampleComplaints.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: "#0F172A" }}>{c.id}</td>
                    <td><strong>{c.product}</strong></td>
                    <td>{c.date}</td>
                    <td>{c.location}</td>
                    <td>Legal Metrology Decl. Missing</td>
                    <td>
                      <span className="sf-admin-status-chip sf-admin-status-inprogress">
                        {c.status}
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
  );
}

