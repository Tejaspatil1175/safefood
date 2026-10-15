import React from "react";
import { Link } from "react-router-dom";
import { Download, Camera, RefreshCw } from "lucide-react";
import { portalHref } from "@/lib/safefood-demo";

interface CitizenHistoryViewProps {
  scans: any[];
  loading: boolean;
  totalCount: number;
  onRefresh: () => void;
  onViewDetails: (scan: any) => void;
  onDownloadPdf: (scan: any) => void;
  onLodgeGrievance: (scan: any) => void;
}

export function CitizenHistoryView({
  scans,
  loading,
  totalCount,
  onRefresh,
  onViewDetails,
  onDownloadPdf,
  onLodgeGrievance,
}: CitizenHistoryViewProps) {
  return (
    <div>
      <div className="sf-web-section-head">
        <div>
          <h3>My Inspection & Scan Archive ({totalCount})</h3>
          <p>Real-time database log of all food packages audited by your account</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={onRefresh}
            className="sf-web-pill-secondary"
            style={{ fontSize: 12, padding: "6px 12px", height: "auto" }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} /> Refresh Archive
          </button>
          <Link to={portalHref("user", "scan")}>+ Scan New Product &rarr;</Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#7A6F5D" }}>
          Loading scan archive from database...
        </div>
      ) : scans.length === 0 ? (
        <div className="sf-web-card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <Camera style={{ width: 44, height: 44, margin: "0 auto 12px", color: "#D35400" }} />
          <h4 style={{ margin: "0 0 6px", fontSize: 17, color: "#201E1A" }}>
            Your history is empty
          </h4>
          <p style={{ color: "#7A6F5D", margin: "0 0 16px", fontSize: 13 }}>
            Start scanning products to build your inspection archive.
          </p>
          <Link to={portalHref("user", "scan")} className="sf-web-pill-btn" style={{ margin: "0 auto" }}>
            <span>Scan Food Packaging</span>
          </Link>
        </div>
      ) : (
        <div className="sf-web-products-grid">
          {scans.map((scan) => (
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
                  {scan.warning ? "⚠️ Issue Flagged" : "✅ Compliant"}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: "12px", color: "#5D5445", lineHeight: 1.5 }}>
                {scan.warning
                  ? "Non-compliance detected in Legal Metrology declarations or font specifications."
                  : "Verified compliant with FSSAI regulations and Legal Metrology Act standards."}
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
                    View Details &rarr;
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
                      onClick={() => onLodgeGrievance(scan)}
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
    </div>
  );
}
