import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  const navigate = useNavigate();
  const locationInfo = parsePortalLocation(_splat);
  const { role, activeSection, isInvestigationDetail, isComplaintCreate, isComplaintDetail } = locationInfo;
  const currentRoleConfig = portalRoles[role];

  // Local interactive states for demonstration
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
    navigate({ to: `/app/${newRole}/dashboard` });
  };

  return (
    <div className="sf-demo sf-demo-app">
      {/* Top sticky navigation bar */}
      <header className="sf-demo-topbar">
        <div className="sf-demo-topbar-left">
          <Link to="/" className="sf-demo-brand" aria-label="SafeFood Home">
            <span className="sf-demo-brand-mark">
              <ShieldCheck />
            </span>
            <span>SafeFood</span>
          </Link>

          <span className="sf-demo-divider" />
          <span className="sf-demo-workspace-label">
            {role === "user" && "Citizen Consumer Portal"}
            {role === "officer" && "Food Safety Enforcement Division"}
            {role === "admin" && "Regulatory & District Oversight Workspace"}
          </span>
        </div>

        <div className="sf-demo-topbar-right">
          <span className="sf-demo-demo-chip">
            <ShieldCheck />
            Interactive Demo
          </span>

          <div className="sf-demo-user-chip">
            <span className="sf-demo-avatar">{currentRoleConfig.initials}</span>
            <div>
              <strong>{currentRoleConfig.name}</strong>
              <div style={{ color: "var(--sf-quiet)", fontSize: "10px" }}>
                {currentRoleConfig.title}
              </div>
            </div>
          </div>

          <Link
            to="/login"
            className="sf-demo-text-link"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "11px" }}
            title="Sign out to demo login"
          >
            <LogOut style={{ width: 14, height: 14 }} />
            <span>Sign out</span>
          </Link>
        </div>
      </header>

      {/* App main layout grid: Sidebar + Workspace */}
      <div className="sf-demo-app-grid">
        {/* Navigation Sidebar */}
        <aside className="sf-demo-sidebar">
          <span className="sf-demo-sidebar-heading">NAVIGATION</span>

          <nav className="sf-demo-nav-list" aria-label="Portal Navigation">
            {currentRoleConfig.navigation.map((item) => {
              const itemFullPath = portalHref(role, item.path);
              const isCurrent =
                (item.path === "dashboard" && activeSection === "dashboard") ||
                (item.path !== "dashboard" && activeSection.startsWith(item.path.split("/")[0] ?? ""));
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={itemFullPath}
                  className={`sf-demo-nav-link ${isCurrent ? "sf-demo-nav-link-active" : ""}`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Role Switcher */}
          <div className="sf-demo-role-switch">
            <p>SWITCH DEMO PERSONA</p>
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value as SafeFoodRole)}
              aria-label="Switch portal role"
            >
              <option value="user">Citizen (Aarav Sharma)</option>
              <option value="officer">Officer (Inspector Meera)</option>
              <option value="admin">Administrator (Regulatory Head)</option>
            </select>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="sf-demo-workspace">
          {/* Header & Breadcrumb */}
          <div className="sf-demo-page-head">
            <div>
              <div className="sf-demo-breadcrumb">
                SafeFood &rsaquo; {role.toUpperCase()} &rsaquo; {activeSection.toUpperCase()}
              </div>
              <h1>
                {activeSection === "dashboard" && `Welcome, ${currentRoleConfig.name}`}
                {activeSection === "scan" && (role === "officer" ? "Statutory Label Inspection Audit" : "Scan Food Product Label")}
                {activeSection === "history" && "Inspection & Scan History"}
                {activeSection === "complaints" && !isComplaintCreate && !isComplaintDetail && (role === "admin" ? "District Grievances Queue" : "My Filed Grievances")}
                {isComplaintCreate && "File a Legal Metrology Grievance"}
                {isComplaintDetail && "Grievance Detail & Statutory Timeline"}
                {activeSection === "investigations" && !isInvestigationDetail && "Enforcement Investigations Queue"}
                {isInvestigationDetail && "Investigation Case File INV-873"}
                {activeSection === "users" && "Registered Citizens Directory"}
                {activeSection === "officers" && "District Enforcement Officer Fleet"}
                {activeSection === "settings" && "Account & Platform Settings"}
              </h1>
              <p>
                {role === "user" && "Verify packaged food declarations, identify illegal tiny fonts, and lodge grievances directly to district food safety officers."}
                {role === "officer" && "Conduct market inspections, auto-verify non-compliant products under PCR 2011, and issue statutory notices."}
                {role === "admin" && "Monitor compliance rates across districts, deploy field officers, and review consumer protection grievances."}
              </p>
            </div>

            <div className="sf-demo-page-actions">
              {role === "user" && (
                <>
                  <Link to={portalHref("user", "scan")} className="sf-demo-primary-action">
                    <ScanLine style={{ width: 14, height: 14, display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                    Scan Label
                  </Link>
                  <Link to={portalHref("user", "complaints/new")} className="sf-demo-quick-link" style={{ minHeight: 36, padding: "0 12px" }}>
                    <FilePlus2 style={{ width: 14, height: 14 }} />
                    File Grievance
                  </Link>
                </>
              )}
              {role === "officer" && (
                <Link to={portalHref("officer", "scan")} className="sf-demo-primary-action">
                  <ScanLine style={{ width: 14, height: 14, display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                  Field Inspection Scan
                </Link>
              )}
              {role === "admin" && (
                <Link to={portalHref("admin", "officers")} className="sf-demo-primary-action">
                  <UserCog style={{ width: 14, height: 14, display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                  Deploy Officer
                </Link>
              )}
            </div>
          </div>

          {/* SECTION: DASHBOARD */}
          {activeSection === "dashboard" && (
            <>
              {/* Stat Cards */}
              <div className="sf-demo-stat-grid">
                {role === "user" && (
                  <>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">TOTAL LABELS SCANNED</span>
                        <span className="sf-demo-stat-icon"><ScanLine /></span>
                      </div>
                      <strong>28</strong>
                      <small>Across snacks, dairy & staples</small>
                    </div>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">COMPLIANT PRODUCTS</span>
                        <span className="sf-demo-stat-icon"><CheckCircle2 /></span>
                      </div>
                      <strong>21</strong>
                      <small>Passed PCR 2011 & FSSAI</small>
                    </div>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">ISSUES FLAGGED</span>
                        <span className="sf-demo-stat-icon" style={{ color: "var(--warning)" }}><AlertTriangle /></span>
                      </div>
                      <strong>7</strong>
                      <small>Missing MRP, dates, or address</small>
                    </div>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">GRIEVANCES LODGED</span>
                        <span className="sf-demo-stat-icon"><FileText /></span>
                      </div>
                      <strong>3</strong>
                      <small>1 under investigation, 1 resolved</small>
                    </div>
                  </>
                )}

                {role === "officer" && (
                  <>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">MARKET INSPECTIONS</span>
                        <span className="sf-demo-stat-icon"><ScanLine /></span>
                      </div>
                      <strong>48</strong>
                      <small>In assigned district (Dhule)</small>
                    </div>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">STATUTORY VIOLATIONS</span>
                        <span className="sf-demo-stat-icon" style={{ color: "var(--destructive)" }}><AlertTriangle /></span>
                      </div>
                      <strong>16</strong>
                      <small>PCR Rule 6 breaches logged</small>
                    </div>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">ASSIGNED INVESTIGATIONS</span>
                        <span className="sf-demo-stat-icon"><ClipboardCheck /></span>
                      </div>
                      <strong>5</strong>
                      <small>3 pending field visits</small>
                    </div>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">AUTO-VERIFIED REPORTS</span>
                        <span className="sf-demo-stat-icon"><ShieldCheck /></span>
                      </div>
                      <strong>12</strong>
                      <small>Officer status priority enabled</small>
                    </div>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">STATEWIDE GRIEVANCES</span>
                        <span className="sf-demo-stat-icon"><FileText /></span>
                      </div>
                      <strong>142</strong>
                      <small>Across 9 administrative districts</small>
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
                      <small>Legal notices issued to packers</small>
                    </div>
                    <div className="sf-demo-stat">
                      <div className="sf-demo-stat-top">
                        <span className="sf-demo-stat-label">DISTRICT RESOLUTION RATE</span>
                        <span className="sf-demo-stat-icon"><CheckCircle2 /></span>
                      </div>
                      <strong>84.2%</strong>
                      <small>Average turnaround: 3.2 days</small>
                    </div>
                  </>
                )}
              </div>

              {/* Main Dashboard Grid */}
              <div className="sf-demo-dashboard-grid">
                {/* Primary Content Panel */}
                <div className="sf-demo-panel">
                  <div className="sf-demo-panel-head">
                    <h2>
                      {role === "user" && "Recent Packaged Food Checks"}
                      {role === "officer" && "Active District Grievances & Audits"}
                      {role === "admin" && "Latest District Grievance Feed"}
                    </h2>
                    <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>Live updates</span>
                  </div>

                  <div className="sf-demo-panel-body">
                    <div className="sf-demo-table-wrap">
                      <table className="sf-demo-table">
                        <thead>
                          <tr>
                            <th>IDENTIFIER</th>
                            <th>PRODUCT</th>
                            <th>LOCATION / DISTRICT</th>
                            <th>VERDICT / STATUS</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {role === "user" &&
                            sampleScans.map((scan) => (
                              <tr key={scan.id}>
                                <td>{scan.id}</td>
                                <td>{scan.product}</td>
                                <td>Indiranagar, Bengaluru</td>
                                <td>
                                  <span className={`sf-demo-status ${scan.warning ? "sf-demo-status-warn" : ""}`}>
                                    {scan.warning ? <AlertTriangle style={{ width: 11, height: 11 }} /> : <CheckCircle2 style={{ width: 11, height: 11 }} />}
                                    {scan.result}
                                  </span>
                                </td>
                                <td>
                                  {scan.warning ? (
                                    <Link to={portalHref("user", "complaints/new")} className="sf-demo-text-link">
                                      Lodge Grievance &rarr;
                                    </Link>
                                  ) : (
                                    <span style={{ color: "var(--sf-quiet)" }}>Passed</span>
                                  )}
                                </td>
                              </tr>
                            ))}

                          {role === "officer" &&
                            sampleInvestigations.map((inv) => (
                              <tr key={inv.id}>
                                <td>{inv.id}</td>
                                <td>{inv.product}</td>
                                <td>{inv.district}</td>
                                <td>
                                  <span className="sf-demo-status">
                                    <ClipboardCheck style={{ width: 11, height: 11 }} />
                                    {inv.status}
                                  </span>
                                </td>
                                <td>
                                  <Link to={portalHref("officer", `investigations/${inv.id}`)} className="sf-demo-text-link">
                                    Open Case &rarr;
                                  </Link>
                                </td>
                              </tr>
                            ))}

                          {role === "admin" &&
                            sampleComplaints.map((c) => (
                              <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.product}</td>
                                <td>{c.location}</td>
                                <td>
                                  <span className="sf-demo-status">
                                    {c.status}
                                  </span>
                                </td>
                                <td>
                                  <Link to={portalHref("admin", "complaints")} className="sf-demo-text-link">
                                    Review &rarr;
                                  </Link>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Side Quick Actions & Info Panel */}
                <div style={{ display: "grid", gap: 15 }}>
                  <div className="sf-demo-panel">
                    <div className="sf-demo-panel-head">
                      <h2>Quick Shortcuts</h2>
                    </div>
                    <div className="sf-demo-panel-body">
                      <div className="sf-demo-quick-actions">
                        <Link to={portalHref(role, "scan")} className="sf-demo-quick-link">
                          <ScanLine />
                          <span>Launch OCR & Legal Metrology Scanner</span>
                        </Link>
                        {role === "user" && (
                          <Link to={portalHref("user", "complaints/new")} className="sf-demo-quick-link">
                            <FilePlus2 />
                            <span>File Form PCR-6 Complaint</span>
                          </Link>
                        )}
                        {role === "officer" && (
                          <Link to={portalHref("officer", "investigations")} className="sf-demo-quick-link">
                            <ClipboardCheck />
                            <span>View Assigned Enforcement Cases</span>
                          </Link>
                        )}
                        {role === "admin" && (
                          <Link to={portalHref("admin", "officers")} className="sf-demo-quick-link">
                            <Users />
                            <span>Manage District Officer Fleet</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sf-demo-callout">
                    <Sparkles />
                    <div>
                      <strong>Google Gemini AI Regulatory Audit:</strong>
                      <p style={{ margin: "4px 0 0", color: "var(--sf-quiet)" }}>
                        Automated checks verify declarations against Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011 and FSSAI Packaging Regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SECTION: SCAN / INSPECT */}
          {activeSection === "scan" && (
            <div className="sf-demo-report-grid">
              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>Packaging Label Scanner & OCR Audit</h2>
                  <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>4 camera angles / label sides</span>
                </div>
                <div className="sf-demo-panel-body">
                  <div className="sf-demo-filter-row">
                    <label style={{ fontSize: "11px", fontWeight: 700, alignSelf: "center" }}>Select sample package to inspect:</label>
                    <select
                      value={scanItem.id}
                      onChange={(e) => {
                        const found = sampleScans.find((s) => s.id === e.target.value);
                        if (found) setSelectedScanItem(found);
                      }}
                      aria-label="Select package"
                    >
                      {sampleScans.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.product} ({s.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ border: "1px dashed var(--sf-line)", borderRadius: 6, padding: 18, background: "var(--sf-pale)", textAlign: "center", margin: "14px 0" }}>
                    <ScanLine style={{ width: 36, height: 36, color: "var(--sf-green)", margin: "0 auto 8px" }} />
                    <strong style={{ display: "block", fontSize: "13px" }}>{scanItem.product}</strong>
                    <span style={{ color: "var(--sf-quiet)", fontSize: "11px" }}>Batch B-4029 · Barcode 8901234567890 · Category: {scanItem.category}</span>
                  </div>

                  <h3 className="sf-demo-section-label">Legal Metrology (PCR 2011) Mandatory Declarations</h3>
                  <div className="sf-demo-check-list">
                    {mandatoryDeclarations.map((decl, index) => {
                      const isFailedItem = scanItem.warning && index === 3;
                      const isOk = !isFailedItem && decl.ok;

                      return (
                        <div key={decl.label} className="sf-demo-check-item">
                          <span>
                            {isOk ? <CheckCircle2 /> : <X className="sf-demo-missing" />}
                            <div>
                              <strong>{decl.label}</strong>
                              <div style={{ color: "var(--sf-quiet)", fontSize: "10px" }}>
                                {isFailedItem ? "CRITICAL: Incomplete packer address. Lacks district and pin code." : decl.detail}
                              </div>
                            </div>
                          </span>
                          <span className={`sf-demo-status ${!isOk ? "sf-demo-status-warn" : ""}`}>
                            {isOk ? "COMPLIANT" : "VIOLATION"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {scanItem.warning && (
                    <div style={{ marginTop: 20, textAlign: "right" }}>
                      {role === "user" ? (
                        <Link to={portalHref("user", "complaints/new")} className="sf-demo-primary-action" style={{ display: "inline-block", width: "auto", padding: "10px 18px" }}>
                          Lodge Consumer Grievance with this Scan &rarr;
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="sf-demo-primary-action"
                          style={{ width: "auto", padding: "10px 18px" }}
                          onClick={() => alert("Statutory violation notice logged in district register (Auto-Verified).")}
                        >
                          File Official Enforcement Report (Auto-Verified) &rarr;
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Statutory Audit Sidebar */}
              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>Gemini AI Statutory Legal Audit</h2>
                </div>
                <div className="sf-demo-panel-body" style={{ display: "grid", gap: 14 }}>
                  <div className="sf-demo-callout">
                    <Sparkles />
                    <div>
                      <strong>Executive Summary</strong>
                      <p style={{ margin: "4px 0 0", color: "var(--sf-quiet)" }}>
                        {scanItem.warning
                          ? "Audit failed: Mandatory declaration of manufacturer/packer address is ambiguous under Rule 6(1)(a) of Legal Metrology (Packaged Commodities) Rules, 2011."
                          : "Package satisfies Rule 6 declarations with clear net quantity, MRP including taxes, customer care helpline, and valid 14-digit FSSAI license."}
                      </p>
                    </div>
                  </div>

                  <div style={{ border: "1px solid var(--sf-line)", borderRadius: 5, padding: 12, fontSize: "11px" }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Statutory Legal Reference:</div>
                    <code style={{ color: "var(--sf-green)", fontSize: "10px" }}>
                      Legal Metrology Act 2009, Sec 36 / PCR 2011 Rule 6
                    </code>
                  </div>

                  <div style={{ border: "1px solid var(--sf-line)", borderRadius: 5, padding: 12, fontSize: "11px" }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Recommended Action:</div>
                    <p style={{ margin: 0, color: "var(--sf-quiet)" }}>
                      {scanItem.warning
                        ? "Issue statutory inquiry notice to manufacturer / packer for clarification within 15 days."
                        : "No regulatory intervention required. Product complies with packaging disclosure laws."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: HISTORY */}
          {activeSection === "history" && (
            <div className="sf-demo-panel">
              <div className="sf-demo-panel-head">
                <h2>Inspection & Label Check Archive</h2>
                <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>All recorded scans</span>
              </div>
              <div className="sf-demo-panel-body">
                <div className="sf-demo-table-wrap">
                  <table className="sf-demo-table">
                    <thead>
                      <tr>
                        <th>SCAN ID</th>
                        <th>PRODUCT NAME</th>
                        <th>CATEGORY</th>
                        <th>DATE & TIME</th>
                        <th>STATUTORY VERDICT</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleScans.map((s) => (
                        <tr key={s.id}>
                          <td>{s.id}</td>
                          <td>{s.product}</td>
                          <td>{s.category}</td>
                          <td>{s.date}</td>
                          <td>
                            <span className={`sf-demo-status ${s.warning ? "sf-demo-status-warn" : ""}`}>
                              {s.warning ? <AlertTriangle style={{ width: 11, height: 11 }} /> : <CheckCircle2 style={{ width: 11, height: 11 }} />}
                              {s.result}
                            </span>
                          </td>
                          <td>
                            <Link to={portalHref(role, "scan")} className="sf-demo-text-link">
                              View Inspection &rarr;
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: COMPLAINTS / GRIEVANCES (CITIZEN & ADMIN) */}
          {activeSection === "complaints" && !isComplaintCreate && !isComplaintDetail && (
            <div className="sf-demo-panel">
              <div className="sf-demo-panel-head">
                <h2>{role === "admin" ? "All District Grievances Queue" : "My Lodged Grievances"}</h2>
                {role === "user" && (
                  <Link to={portalHref("user", "complaints/new")} className="sf-demo-primary-action" style={{ width: "auto", minHeight: 32, padding: "0 12px" }}>
                    + New Grievance
                  </Link>
                )}
              </div>
              <div className="sf-demo-panel-body">
                <div className="sf-demo-table-wrap">
                  <table className="sf-demo-table">
                    <thead>
                      <tr>
                        <th>GRIEVANCE ID</th>
                        <th>PRODUCT</th>
                        <th>LOCATION / DISTRICT</th>
                        <th>FILED ON</th>
                        <th>ASSIGNED OFFICER</th>
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
                          <td>{c.date}</td>
                          <td>{c.officer}</td>
                          <td>
                            <span className="sf-demo-status">
                              {c.status}
                            </span>
                          </td>
                          <td>
                            <Link to={portalHref(role, `complaints/${c.id}`)} className="sf-demo-text-link">
                              View Details &rarr;
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION: CREATE COMPLAINT */}
          {isComplaintCreate && (
            <div className="sf-demo-panel sf-demo-form-panel">
              <div className="sf-demo-panel-head">
                <h2>Lodge a Legal Metrology (PCR 2011) Grievance</h2>
              </div>
              <div className="sf-demo-panel-body">
                {complaintSubmitted ? (
                  <div style={{ textAlign: "center", padding: "30px 0" }}>
                    <CheckCircle2 style={{ width: 44, height: 44, color: "var(--sf-green)", margin: "0 auto 10px" }} />
                    <h3 style={{ fontSize: "18px", fontWeight: 800 }}>Grievance Successfully Lodged</h3>
                    <p style={{ color: "var(--sf-quiet)", fontSize: "12px", maxWidth: 440, margin: "6px auto 16px" }}>
                      Your complaint has been assigned Grievance ID <strong>GRV-2051</strong> and routed to the Food Safety Officer in <strong>{newComplaintDistrict}</strong>.
                    </p>
                    <Link to={portalHref("user", "complaints")} className="sf-demo-primary-action" style={{ display: "inline-block", width: "auto", padding: "10px 22px" }}>
                      View In Complaints Queue
                    </Link>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setComplaintSubmitted(true);
                    }}
                  >
                    <div className="sf-demo-form-grid">
                      <div className="sf-demo-field sf-demo-field-full">
                        <label>Non-Compliant Scanned Product</label>
                        <input type="text" readOnly value="Almond Oat Energy Bar (Batch B-4029) — Incomplete Packer Address" />
                      </div>

                      <div className="sf-demo-field">
                        <label>Purchased / Detected In District</label>
                        <select
                          value={newComplaintDistrict}
                          onChange={(e) => setNewComplaintDistrict(e.target.value)}
                        >
                          <option value="DHULE">DHULE</option>
                          <option value="PUNE">PUNE</option>
                          <option value="MUMBAI">MUMBAI</option>
                          <option value="NAGPUR">NAGPUR</option>
                          <option value="BENGALURU URBAN">BENGALURU URBAN</option>
                        </select>
                      </div>

                      <div className="sf-demo-field">
                        <label>Store / Purchase Address</label>
                        <input type="text" required placeholder="e.g. Shop 4, Station Road Market" />
                      </div>

                      <div className="sf-demo-field sf-demo-field-full">
                        <label>Consumer Grievance Statement / Note</label>
                        <textarea
                          value={newComplaintNote}
                          onChange={(e) => setNewComplaintNote(e.target.value)}
                          placeholder="Describe the label issue (e.g. address details missing, font size smaller than prescribed under PCR 2011 Rule 6)..."
                          required
                        />
                      </div>

                      <div className="sf-demo-field sf-demo-field-full">
                        <label>Evidence Photos (GridFS demo)</label>
                        <div style={{ border: "1px dashed var(--sf-line)", borderRadius: 4, padding: "12px", fontSize: "11px", color: "var(--sf-quiet)", textAlign: "center" }}>
                          Front label and nutritional table photos automatically attached from inspection scan.
                        </div>
                      </div>

                      <div className="sf-demo-field-full" style={{ marginTop: 12 }}>
                        <button type="submit" className="sf-demo-primary-action">
                          Submit Grievance to District Officer &rarr;
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* SUB-SECTION: COMPLAINT DETAIL & TIMELINE */}
          {isComplaintDetail && (
            <div className="sf-demo-report-grid">
              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>Grievance Case GRV-2048</h2>
                  <span className="sf-demo-status">Under investigation</span>
                </div>
                <div className="sf-demo-panel-body">
                  <div style={{ display: "grid", gap: 12, fontSize: "12px" }}>
                    <div>
                      <strong>Product:</strong> Almond Oat Energy Bar (40 g)
                    </div>
                    <div>
                      <strong>Location:</strong> Indiranagar Market, Bengaluru Urban
                    </div>
                    <div>
                      <strong>Assigned Enforcement Officer:</strong> Inspector Meera Iyer (OFF-BLR-892)
                    </div>
                    <div>
                      <strong>Statutory Violations:</strong>
                      <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "var(--destructive)" }}>
                        <li>Rule 6(1)(a): Incomplete name and address of the manufacturer/packer</li>
                        <li>Rule 7: Mandatory declaration font height less than 2.0 mm</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="sf-demo-section-label">Official Grievance Timeline</h3>
                  <div className="sf-demo-timeline">
                    <div className="sf-demo-timeline-step">
                      <span className="sf-demo-timeline-mark"><Check /></span>
                      <div>
                        <strong>Grievance Submitted by Citizen</strong>
                        <small>Oct 11, 2026 at 10:45 am · Status: IN_REVIEW</small>
                      </div>
                    </div>
                    <div className="sf-demo-timeline-step">
                      <span className="sf-demo-timeline-mark"><Check /></span>
                      <div>
                        <strong>Assigned to District Officer Meera Iyer</strong>
                        <small>Oct 11, 2026 at 02:15 pm · Status: ASSIGNED</small>
                      </div>
                    </div>
                    <div className="sf-demo-timeline-step">
                      <span className="sf-demo-timeline-mark"><Check /></span>
                      <div>
                        <strong>Physical Inspection Conducted at Retailer</strong>
                        <small>Oct 12, 2026 at 11:30 am · Status: UNDER_INVESTIGATION</small>
                      </div>
                    </div>
                    <div className="sf-demo-timeline-step">
                      <span className="sf-demo-timeline-mark" style={{ background: "var(--background)", border: "1px solid var(--sf-line)", color: "var(--sf-quiet)" }}>4</span>
                      <div>
                        <strong>Statutory Notice Issued to Packer</strong>
                        <small>Pending formal reply from manufacturer</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Side Panel */}
              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>Official Report Export</h2>
                </div>
                <div className="sf-demo-panel-body" style={{ display: "grid", gap: 14 }}>
                  <div className="sf-demo-callout">
                    <Download />
                    <div>
                      <strong>Export PDF Report</strong>
                      <p style={{ margin: "4px 0 0", color: "var(--sf-quiet)" }}>
                        Download official legal metrology compliance complaint report with AI statutory citations.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="sf-demo-primary-action"
                    onClick={() => alert("Downloading official PDF: complaint-GRV-2048.pdf (SafeFood Compliance Report with Gemini AI audit).")}
                  >
                    Download PDF Complaint
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: INVESTIGATIONS (OFFICER) */}
          {activeSection === "investigations" && !isInvestigationDetail && (
            <div className="sf-demo-panel">
              <div className="sf-demo-panel-head">
                <h2>Assigned Field Investigations</h2>
                <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>Officer Queue</span>
              </div>
              <div className="sf-demo-panel-body">
                <div className="sf-demo-table-wrap">
                  <table className="sf-demo-table">
                    <thead>
                      <tr>
                        <th>CASE ID</th>
                        <th>ORIGINATING GRIEVANCE</th>
                        <th>SUSPECT PRODUCT</th>
                        <th>DISTRICT</th>
                        <th>ASSIGNED DATE</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleInvestigations.map((inv) => (
                        <tr key={inv.id}>
                          <td>{inv.id}</td>
                          <td>{inv.complaint}</td>
                          <td>{inv.product}</td>
                          <td>{inv.district}</td>
                          <td>{inv.assigned}</td>
                          <td>
                            <span className="sf-demo-status">
                              {inv.status}
                            </span>
                          </td>
                          <td>
                            <Link to={portalHref("officer", `investigations/${inv.id}`)} className="sf-demo-text-link">
                              Inspect Case &rarr;
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION: INVESTIGATION DETAIL (OFFICER) */}
          {isInvestigationDetail && (
            <div className="sf-demo-report-grid">
              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>Investigation Case File: INV-873</h2>
                  <span className="sf-demo-status">In progress</span>
                </div>
                <div className="sf-demo-panel-body">
                  <div style={{ display: "grid", gap: 12, fontSize: "12px" }}>
                    <div><strong>Grievance Reference:</strong> GRV-2048</div>
                    <div><strong>Suspect Product:</strong> Almond Oat Energy Bar (Batch B-4029)</div>
                    <div><strong>Alleged Breach:</strong> Legal Metrology PCR 2011 Rule 6 (Incomplete Packer Address)</div>
                  </div>

                  <h3 className="sf-demo-section-label">Update Field Inspection Status & Notes</h3>
                  {officerActionSaved ? (
                    <div style={{ padding: "14px", border: "1px solid var(--sf-green)", borderRadius: 5, background: "var(--sf-pale)", color: "var(--sf-green)", fontSize: "12px", marginBottom: 15 }}>
                      <CheckCircle2 style={{ display: "inline", width: 14, height: 14, marginRight: 6, verticalAlign: "middle" }} />
                      Enforcement record updated and synced with District Administration!
                    </div>
                  ) : null}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setOfficerActionSaved(true);
                    }}
                  >
                    <div className="sf-demo-form-fields">
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
                        <label>Officer Field Notes & Findings</label>
                        <textarea
                          value={officerNote}
                          onChange={(e) => setOfficerNote(e.target.value)}
                          placeholder="Record inspection observations, seized sample details, or batch numbers..."
                          required
                        />
                      </div>

                      <button type="submit" className="sf-demo-primary-action">
                        Save Enforcement Record &rarr;
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>Statutory Enforcement Powers</h2>
                </div>
                <div className="sf-demo-panel-body" style={{ display: "grid", gap: 14 }}>
                  <div className="sf-demo-callout">
                    <ShieldCheck />
                    <div>
                      <strong>Auto-Verification Active</strong>
                      <p style={{ margin: "4px 0 0", color: "var(--sf-quiet)" }}>
                        As an authorized Food Safety Enforcement Officer, all reports submitted by your account are tagged VERIFIED immediately in the statutory district register.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="sf-demo-primary-action"
                    onClick={() => alert("Official Statutory Notice draft generated under Section 36 of Legal Metrology Act.")}
                  >
                    Generate Statutory Notice Draft
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: USERS (ADMIN) */}
          {activeSection === "users" && (
            <div className="sf-demo-panel">
              <div className="sf-demo-panel-head">
                <h2>Registered Citizens & Consumers Directory</h2>
                <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>District Consumer Base</span>
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
                        <th>GRIEVANCES LODGED</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Aarav Sharma</td>
                        <td>aarav@safefood.in</td>
                        <td>DHULE</td>
                        <td>28</td>
                        <td>3</td>
                        <td><span className="sf-demo-status">Active</span></td>
                      </tr>
                      <tr>
                        <td>Pooja Deshmukh</td>
                        <td>pooja@safefood.in</td>
                        <td>PUNE</td>
                        <td>14</td>
                        <td>1</td>
                        <td><span className="sf-demo-status">Active</span></td>
                      </tr>
                      <tr>
                        <td>Nikhil Kulkarni</td>
                        <td>nikhil@safefood.in</td>
                        <td>MUMBAI</td>
                        <td>42</td>
                        <td>6</td>
                        <td><span className="sf-demo-status">Active</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: OFFICERS (ADMIN) */}
          {activeSection === "officers" && (
            <div className="sf-demo-report-grid">
              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>District Enforcement Officer Fleet</h2>
                  <span style={{ fontSize: "11px", color: "var(--sf-quiet)" }}>34 Deployed Officers</span>
                </div>
                <div className="sf-demo-panel-body">
                  <div className="sf-demo-table-wrap">
                    <table className="sf-demo-table">
                      <thead>
                        <tr>
                          <th>OFFICER NAME</th>
                          <th>BADGE NUMBER</th>
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
                        <tr>
                          <td>Inspector Sanjay Verma</td>
                          <td>OFF-MUM-7731</td>
                          <td>MUMBAI</td>
                          <td>12</td>
                          <td><span className="sf-demo-status">On Duty</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Deploy New Officer Form */}
              <div className="sf-demo-panel">
                <div className="sf-demo-panel-head">
                  <h2>Deploy / Create Field Officer</h2>
                </div>
                <div className="sf-demo-panel-body">
                  {officerAddedMessage ? (
                    <div style={{ padding: "12px", background: "var(--sf-pale)", border: "1px solid var(--sf-green)", borderRadius: 4, color: "var(--sf-green)", fontSize: "11px" }}>
                      Field officer deployed successfully to district {newOfficerDistrict}!
                    </div>
                  ) : null}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setOfficerAddedMessage(true);
                      setNewOfficerName("");
                    }}
                  >
                    <div className="sf-demo-form-fields">
                      <div className="sf-demo-field">
                        <label>Officer Full Name</label>
                        <input
                          type="text"
                          value={newOfficerName}
                          onChange={(e) => setNewOfficerName(e.target.value)}
                          placeholder="e.g. Inspector Anil Shinde"
                          required
                        />
                      </div>

                      <div className="sf-demo-field">
                        <label>Assigned District Jurisdiction</label>
                        <select
                          value={newOfficerDistrict}
                          onChange={(e) => setNewOfficerDistrict(e.target.value)}
                        >
                          <option value="DHULE">DHULE</option>
                          <option value="PUNE">PUNE</option>
                          <option value="MUMBAI">MUMBAI</option>
                          <option value="NAGPUR">NAGPUR</option>
                          <option value="NASHIK">NASHIK</option>
                        </select>
                      </div>

                      <button type="submit" className="sf-demo-primary-action">
                        Deploy Field Officer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: SETTINGS */}
          {activeSection === "settings" && (
            <div className="sf-demo-panel sf-demo-form-panel">
              <div className="sf-demo-panel-head">
                <h2>Account & Platform Preferences</h2>
              </div>
              <div className="sf-demo-panel-body">
                <div className="sf-demo-form-fields">
                  <div className="sf-demo-field">
                    <label>Active Account Persona</label>
                    <input type="text" readOnly value={`${currentRoleConfig.name} (${currentRoleConfig.title})`} />
                  </div>

                  <div className="sf-demo-field">
                    <label>Assigned District</label>
                    <input type="text" readOnly value="DHULE / MAHARASHTRA" />
                  </div>

                  <div className="sf-demo-toggle-line">
                    <div>
                      <strong>Legal Metrology PCR 2011 Automated Alerts</strong>
                      <div style={{ color: "var(--sf-quiet)", fontSize: "10px" }}>Receive alerts when non-compliant products are flagged in your district.</div>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>

                  <div className="sf-demo-toggle-line">
                    <div>
                      <strong>Google Gemini AI Regulatory Audit Summaries</strong>
                      <div style={{ color: "var(--sf-quiet)", fontSize: "10px" }}>Include automated statutory legal summaries in exported PDF reports.</div>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="sf-demo-footer-note">
            SafeFood Prototype Environment · Designed strictly to match existing typography, color tokens, and layout guidelines.
          </div>
        </main>
      </div>
    </div>
  );
}
