import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, Camera, Download, ShieldCheck } from "lucide-react";
import { portalHref } from "@/lib/safefood-demo";

interface CitizenDashboardViewProps {
  liveScans: any[];
  totalScansCount: number;
  compliantCount: number;
  violationsCount: number;
  complaintsCount: number;
  loadingScans: boolean;
  fetchScans: () => void;
  onViewDetails: (scan: any) => void;
  onDownloadPdf: (scan: any) => void;
  onSelectScanForGrievance: (scan: any) => void;
}

export function CitizenDashboardView({
  liveScans,
  totalScansCount,
  compliantCount,
  violationsCount,
  complaintsCount,
  loadingScans,
  fetchScans,
  onViewDetails,
  onDownloadPdf,
  onSelectScanForGrievance,
}: CitizenDashboardViewProps) {
  return (
    <>
      {/* Hero Header */}
      <section className="sf-web-hero-centered">
        <div className="sf-web-hero-kicker" style={{ justifyContent: "center" }}>
          <span className="sf-web-hero-kicker-dot" />
          Live Packaging Compliance · Legal Metrology Act 2009
        </div>
        <h1 className="sf-web-hero-title-main" style={{ textAlign: "center" }}>
          Verify Food Packaging.
          <br />
          <em>Detect Rule 6 Violations Instantly.</em>
        </h1>
        <p className="sf-web-hero-subtext" style={{ textAlign: "center", margin: "0 auto 28px" }}>
          AI-powered optical scanner that verifies mandatory declarations, font specifications,
          and hidden packaging rules before you buy or file a grievance.
        </p>

        <div className="sf-web-hero-actions" style={{ justifyContent: "center" }}>
          <Link to={portalHref("user", "scan")} className="sf-web-pill-btn">
            <span>Scan Packaged Food Label</span>
            <div className="sf-web-pill-arrow">
              <ArrowRight style={{ width: 16, height: 16 }} />
            </div>
          </Link>
          <Link to={portalHref("user", "history")} className="sf-web-pill-secondary">
            Browse Verified Archive &rarr;
          </Link>
        </div>
      </section>

      {/* Real-time Database Statistics Strip */}
      <section className="sf-web-stats-strip" aria-label="Consumer Protection Metrics">
        <div className="sf-web-stat-card">
          <div className="sf-web-stat-label">Live Scans Audited</div>
          <div className="sf-web-stat-value">{totalScansCount}</div>
          <div className="sf-web-stat-sub">From district database</div>
        </div>
        <div className="sf-web-stat-card">
          <div className="sf-web-stat-label">Rule 6 Certified</div>
          <div className="sf-web-stat-value" style={{ color: "#1E6B4A" }}>
            {compliantCount}
          </div>
          <div className="sf-web-stat-sub">All statutory declarations intact</div>
        </div>
        <div className="sf-web-stat-card">
          <div className="sf-web-stat-label">Violations Flagged</div>
          <div className="sf-web-stat-value" style={{ color: "#D35400" }}>
            {violationsCount}
          </div>
          <div className="sf-web-stat-sub">Misleading or missing prints</div>
        </div>
        <div className="sf-web-stat-card">
          <div className="sf-web-stat-label">Active Grievances</div>
          <div className="sf-web-stat-value">{complaintsCount}</div>
          <div className="sf-web-stat-sub">Routed to Food Safety Officers</div>
        </div>
      </section>

      {/* Recent Scans Showcase */}
      <section className="sf-web-section">
        <div className="sf-web-section-head">
          <div>
            <h3>Recent Product Audits</h3>
            <p>Real-time stream of packaged goods inspected by citizens</p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={fetchScans}
              className="sf-web-pill-secondary"
              style={{ fontSize: 11, padding: "4px 10px", height: "auto" }}
              title="Refresh from API"
            >
              <RefreshCw style={{ width: 12, height: 12 }} /> Refresh
            </button>
            <Link to={portalHref("user", "history")}>
              View All ({totalScansCount}) &rarr;
            </Link>
          </div>
        </div>

        {loadingScans ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#7A6F5D" }}>
            Loading scans from backend...
          </div>
        ) : liveScans.length === 0 ? (
          <div
            className="sf-web-card"
            style={{ textAlign: "center", padding: "40px 20px", color: "#7A6F5D" }}
          >
            <Camera style={{ width: 44, height: 44, margin: "0 auto 12px", color: "#D35400" }} />
            <h4 style={{ margin: "0 0 6px", fontSize: 17, color: "#201E1A" }}>
              No Scans Recorded Yet
            </h4>
            <p style={{ margin: "0 0 16px", fontSize: 13 }}>
              Take a photo of any packaged snack, dairy, or staple to inspect its Legal Metrology compliance.
            </p>
            <Link to={portalHref("user", "scan")} className="sf-web-pill-btn" style={{ margin: "0 auto" }}>
              <span>Scan Packaging Now</span>
            </Link>
          </div>
        ) : (
          <div className="sf-web-products-grid">
            {liveScans.slice(0, 6).map((scan) => (
              <div key={scan.id} className="sf-web-product-card">
                <div className="sf-web-product-card-top">
                  <div>
                    <span className="sf-web-product-category">{scan.category}</span>
                    <h4 className="sf-web-product-title">{scan.product}</h4>
                    <div className="sf-web-product-meta">
                      {scan.id.slice(-8)} · {scan.date}
                    </div>
                  </div>

                  <span
                    className={`sf-web-badge ${scan.warning ? "sf-web-badge-warn" : "sf-web-badge-ok"}`}
                  >
                    {scan.warning ? "⚠️ Rule 6 Issue" : "✅ Certified Safe"}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: "12px", color: "#5D5445", lineHeight: 1.5 }}>
                  {scan.warning
                    ? "Potential violation flagged: One or more mandatory declarations (packer address, MRP, or font height) missing or ambiguous."
                    : "Fully compliant: Clear MRP inclusive of taxes, net weight, expiry date, customer care helpline & valid statutory details."}
                </p>

                <div className="sf-web-product-actions">
                  <span style={{ fontSize: "11px", color: "#8C8270" }}>
                    {scan.mrp ? `MRP: ₹${scan.mrp}` : "Packaged Good"}
                  </span>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => onViewDetails(scan)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#1E6B4A",
                        padding: 0,
                      }}
                    >
                      Details &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadPdf(scan)}
                      title="Download / Print PDF Audit"
                      style={{
                        background: "#FAF5EA",
                        border: "1px solid #DFD4BD",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "#201E1A",
                      }}
                    >
                      <Download style={{ width: 11, height: 11 }} /> PDF
                    </button>
                    {scan.warning && (
                      <Link
                        to={portalHref("user", "complaints/new")}
                        onClick={() => onSelectScanForGrievance(scan)}
                        style={{ color: "#C85A32", fontSize: "12px", fontWeight: 700 }}
                      >
                        Grievance &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
