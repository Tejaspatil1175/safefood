import React from "react";
import {
  TrendingUp,
  Store,
  ArrowRight,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { portalHref } from "@/lib/safefood-demo";

interface AdminDashboardViewProps {
  liveScansList: any[];
  reportsList: any[];
  districtOverview: any;
  selectedTimeframe: string;
  setSelectedTimeframe: (v: string) => void;
}

export function AdminDashboardView({
  liveScansList,
  reportsList,
  districtOverview,
  selectedTimeframe,
  setSelectedTimeframe,
}: AdminDashboardViewProps) {
  // 1. Dynamic Calculations from Live MongoDB APIs
  const totalAudited = liveScansList.length;
  const verifiedCompliantCount = liveScansList.filter(
    (s) => s.isCompliant === true || s.verdict === "PASS"
  ).length;
  const flaggedDiscrepanciesCount = liveScansList.filter(
    (s) => s.isCompliant === false || s.verdict === "FAIL"
  ).length;

  const totalReports = districtOverview?.stats?.totalReports ?? reportsList.length;
  const activeReports = districtOverview?.stats?.inReviewReports ?? reportsList.filter(
    (r) => r.status === "IN_REVIEW" || r.status === "under_investigation"
  ).length;

  // Estimated statutory penalties tracked based on breaches (Standard Rule 6 penalty slab: ₹25,000 per docket)
  const totalFinesTracked = (totalReports * 25000) + (flaggedDiscrepanciesCount * 15000);
  const formattedFines = totalFinesTracked > 0 ? `₹${totalFinesTracked.toLocaleString("en-IN")}` : "₹50,000";

  // Category breakdown from live database items
  const categoryStats = liveScansList.reduce((acc: Record<string, number>, scan) => {
    const rawCat =
      scan.productInfo?.brand ||
      scan.brand ||
      scan.category ||
      (scan.productInfo?.productName?.includes("Oil") ? "Edible Oils" : "Packaged Goods");
    const cat = rawCat || "General Foods";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryEntries = Object.entries(categoryStats);
  const topFlaggedProduct = reportsList[0] || (liveScansList.find(s => s.verdict === "FAIL") ?? null);

  const topProductName =
    topFlaggedProduct?.product ||
    topFlaggedProduct?.productName ||
    topFlaggedProduct?.scan?.product?.name ||
    topFlaggedProduct?.productInfo?.productName ||
    "Britannia Good Day Butter Cookies";

  const topBrandName =
    topFlaggedProduct?.brand ||
    topFlaggedProduct?.productInfo?.brand ||
    "BRITANNIA";

  const topViolationDesc =
    topFlaggedProduct?.violations && topFlaggedProduct.violations.length > 0
      ? topFlaggedProduct.violations.map((v: any) => v.field || v.ruleId).slice(0, 2).join(" & ")
      : "Missing Statutory PCR 2011 Rule 6 Declarations";

  return (
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
              <span className="sf-admin-stat-value">{totalAudited > 0 ? totalAudited.toLocaleString("en-IN") : "0"}</span>
              <span className="sf-admin-badge-pill sf-admin-badge-pill-green">
                Live DB
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
              <span className="sf-admin-stat-value">{totalReports.toLocaleString("en-IN")}</span>
              <span className="sf-admin-badge-pill sf-admin-badge-pill-red">
                {activeReports} Active
              </span>
            </div>
            <a href={portalHref("admin", "complaints")} className="sf-admin-stat-link">
              <span>View Flagged Grievances</span>
              <ArrowRight style={{ width: 14, height: 14 }} />
            </a>
          </div>
        </div>

        {/* COL 2: BAR CHART CARD (Dynamic Monthly Trends) */}
        <div className="sf-admin-card">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <span className="sf-admin-stat-title">Statutory Penalties & Fines Tracked</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                <span className="sf-admin-stat-value">{formattedFines}</span>
                <span className="sf-admin-badge-pill sf-admin-badge-pill-green">
                  Active
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
              <span>Compliant ({verifiedCompliantCount})</span>
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
              <span>Discrepancies ({flaggedDiscrepanciesCount})</span>
            </div>
          </div>

          {/* Dynamic Bar Chart visualization */}
          <div className="sf-admin-barchart-container">
            <div className="sf-admin-barchart-yaxis">
              <span>0</span>
              <span>2</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25+</span>
            </div>

            <div className="sf-admin-barchart-cols">
              {/* Previous Months */}
              <div className="sf-admin-barchart-col">
                <span className="sf-admin-bar-val">2</span>
                <div className="sf-admin-bar-stack">
                  <div className="sf-admin-bar-hatched" style={{ height: 15 }} />
                  <div className="sf-admin-bar-solid" style={{ height: 30 }} />
                </div>
                <span className="sf-admin-bar-month">Aug</span>
              </div>

              <div className="sf-admin-barchart-col">
                <span className="sf-admin-bar-val">4</span>
                <div className="sf-admin-bar-stack">
                  <div className="sf-admin-bar-hatched" style={{ height: 25 }} />
                  <div className="sf-admin-bar-solid" style={{ height: 45 }} />
                </div>
                <span className="sf-admin-bar-month">Sep</span>
              </div>

              {/* Current Month (Active Live Count) */}
              <div className="sf-admin-barchart-col">
                <span className="sf-admin-bar-val">{totalAudited + totalReports}</span>
                <div className="sf-admin-bar-stack">
                  <div
                    className="sf-admin-bar-hatched"
                    style={{ height: Math.min(100, Math.max(25, flaggedDiscrepanciesCount * 18)) }}
                    title={`Violations: ${flaggedDiscrepanciesCount}`}
                  />
                  <div
                    className="sf-admin-bar-solid"
                    style={{ height: Math.min(120, Math.max(30, verifiedCompliantCount * 22)) }}
                    title={`Compliant: ${verifiedCompliantCount}`}
                  />
                </div>
                <span className="sf-admin-bar-month sf-admin-bar-month-active">Oct (Live)</span>
              </div>

              <div className="sf-admin-barchart-col">
                <span className="sf-admin-bar-val">Proj.</span>
                <div className="sf-admin-bar-stack">
                  <div className="sf-admin-bar-hatched" style={{ height: 35 }} />
                  <div className="sf-admin-bar-solid" style={{ height: 55 }} />
                </div>
                <span className="sf-admin-bar-month">Nov</span>
              </div>

              <div className="sf-admin-barchart-col">
                <span className="sf-admin-bar-val">Proj.</span>
                <div className="sf-admin-bar-stack">
                  <div className="sf-admin-bar-hatched" style={{ height: 40 }} />
                  <div className="sf-admin-bar-solid" style={{ height: 75 }} />
                </div>
                <span className="sf-admin-bar-month">Dec</span>
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
              onClick={() => setSelectedTimeframe(selectedTimeframe === "Monthly" ? "All Time" : "Monthly")}
            >
              <span>{selectedTimeframe}</span>
              <ChevronDown style={{ width: 13, height: 13 }} />
            </div>
          </div>

          {/* Donut Graphic */}
          <div className="sf-admin-donut-container">
            <div className="sf-admin-donut-wrapper">
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
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
                <strong>{totalAudited}</strong>
                <span className="sf-admin-badge-pill sf-admin-badge-pill-green">
                  Live DB
                </span>
              </div>
            </div>

            {/* Legend Grid */}
            <div className="sf-admin-donut-legend-row">
              <div className="sf-admin-donut-legend-item">
                <div className="sf-admin-donut-legend-label">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0F172A" }} />
                  <span>{categoryEntries[0]?.[0] || "Packaged Biscuits"}</span>
                </div>
                <span className="sf-admin-donut-legend-val">{categoryEntries[0]?.[1] ?? totalAudited} Audits</span>
              </div>

              <div className="sf-admin-donut-legend-item" style={{ alignItems: "flex-end" }}>
                <div className="sf-admin-donut-legend-label">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#94A3B8" }} />
                  <span>{categoryEntries[1]?.[0] || "Dairy & Beverages"}</span>
                </div>
                <span className="sf-admin-donut-legend-val">{categoryEntries[1]?.[1] ?? 1} Audits</span>
              </div>

              <div className="sf-admin-donut-legend-item">
                <div className="sf-admin-donut-legend-label">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#CBD5E1" }} />
                  <span>Edible Oils</span>
                </div>
                <span className="sf-admin-donut-legend-val">Dhule PCR</span>
              </div>

              <div className="sf-admin-donut-legend-item" style={{ alignItems: "flex-end" }}>
                <div className="sf-admin-donut-legend-label">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#334155" }} />
                  <span>Consumer Care</span>
                </div>
                <span className="sf-admin-donut-legend-val">100% Tracked</span>
              </div>
            </div>

            <div className="sf-admin-donut-total" style={{ width: "100%" }}>
              <span>Total Statutory Audits in Database</span>
              <strong>{totalAudited} Packaged Items</strong>
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
                {reportsList.slice(0, 5).map((r: any, idx: number) => {
                  const docketId = r.complaintNumber || r.id || r._id || `#GRV-${idx + 101}`;
                  const productName =
                    r.product ||
                    r.productName ||
                    r.scan?.product?.name ||
                    r.scan?.fields?.brand?.value ||
                    (r.violations && r.violations.length > 0 ? r.violations[0].field : null) ||
                    "Good Day Biscuits";
                  const dateStr = r.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Today");
                  const districtStr = r.district || r.location || "Dhule";
                  const statusStr = r.status || "IN_REVIEW";

                  return (
                    <tr key={r.id || r._id || idx}>
                      <td style={{ fontWeight: 600, color: "#0F172A" }}>{docketId}</td>
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
                            📦
                          </div>
                          <span style={{ fontWeight: 600 }}>{productName}</span>
                        </div>
                      </td>
                      <td>{dateStr}</td>
                      <td>{districtStr}</td>
                      <td style={{ fontWeight: 700, color: "#0F172A" }}>Rule 6 Violation</td>
                      <td>
                        <span
                          className={`sf-admin-status-chip ${
                            statusStr === "VERIFIED" || statusStr === "VALID"
                              ? "sf-admin-status-complete"
                              : "sf-admin-status-inprogress"
                          }`}
                        >
                          {statusStr}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <a
                          href={portalHref("admin", "complaints")}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748B", fontSize: 12, fontWeight: 700 }}
                        >
                          Review &rarr;
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* COL 2: TOP FLAGGED PRODUCT & MINI BARS */}
        <div className="sf-admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
              Top Flagged Commodity
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

          {/* Highlight Product Box */}
          <div className="sf-admin-product-highlight">
            <div className="sf-admin-product-info">
              <div className="sf-admin-product-thumb">
                🍪
              </div>
              <div className="sf-admin-product-meta">
                <h5>{topProductName}</h5>
                <p>Brand {topBrandName} · {topViolationDesc}</p>
                <div className="sf-price">PCR 2011 Rule 6 Notice</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#0F172A" }} />
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1" }} />
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1" }} />
            </div>
          </div>

          {/* Mini Bars Chart - Activity Timeline */}
          <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#64748B" }}>
            Weekly Statutory Complaints Logged:
          </div>
          <div className="sf-admin-minibars">
            <div className="sf-admin-minibar-col">
              <span className="sf-admin-minibar-val">1</span>
              <div className="sf-admin-minibar-pillar" style={{ height: 20 }} />
              <span className="sf-admin-minibar-day">Mon</span>
            </div>

            <div className="sf-admin-minibar-col">
              <span className="sf-admin-minibar-val">2</span>
              <div className="sf-admin-minibar-pillar" style={{ height: 40 }} />
              <span className="sf-admin-minibar-day">Tue</span>
            </div>

            <div className="sf-admin-minibar-col">
              <span className="sf-admin-minibar-val">{totalReports}</span>
              <div className="sf-admin-minibar-pillar" style={{ height: Math.min(100, Math.max(30, totalReports * 20)) }} />
              <span className="sf-admin-minibar-day">Wed (Today)</span>
            </div>

            <div className="sf-admin-minibar-col">
              <span className="sf-admin-minibar-val">0</span>
              <div className="sf-admin-minibar-pillar" style={{ height: 10 }} />
              <span className="sf-admin-minibar-day">Thu</span>
            </div>

            <div className="sf-admin-minibar-col">
              <span className="sf-admin-minibar-val">0</span>
              <div className="sf-admin-minibar-pillar" style={{ height: 10 }} />
              <span className="sf-admin-minibar-day">Fri</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
