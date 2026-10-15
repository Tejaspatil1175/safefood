import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Download, X } from "lucide-react";
import { portalHref } from "@/lib/safefood-demo";
import { printTrustLabelPdf } from "./TrustLabelPdf";

interface TrustLabelDetailModalProps {
  scan: any;
  onClose: () => void;
  onSelectScanForGrievance?: (scan: any) => void;
}

export function TrustLabelDetailModal({
  scan,
  onClose,
  onSelectScanForGrievance,
}: TrustLabelDetailModalProps) {
  if (!scan) return null;

  return (
    <div className="sf-modal-overlay" onClick={onClose}>
      <div className="sf-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="sf-modal-header">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <ShieldCheck
                style={{ width: 18, height: 18, color: "#065F46" }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#065F46",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                TrustLabel™ Official Audit Record
              </span>
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 800,
                color: "#201E1A",
              }}
            >
              {scan.product}
            </h3>
            <span style={{ fontSize: "12px", color: "#7A6F5D" }}>
              {scan.category} · Audit ID: {scan.id} · {scan.date}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={() => printTrustLabelPdf(scan)}
              className="sf-web-pill-btn"
              style={{ padding: "8px 16px", fontSize: "12px" }}
            >
              <Download style={{ width: 13, height: 13 }} />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              className="sf-modal-close-btn"
              onClick={onClose}
              title="Close modal"
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Verdict Box */}
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: scan.warning ? "#FFF1F2" : "#ECFDF5",
            border: `1.5px solid ${scan.warning ? "#FECDD3" : "#A7F3D0"}`,
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 800,
              textTransform: "uppercase",
              color: scan.warning ? "#991B1B" : "#065F46",
              marginBottom: "4px",
            }}
          >
            {scan.warning
              ? "⚠️ Statutory Violation Flagged"
              : "✅ Rule 6 Statutory Certified"}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#334155",
              lineHeight: 1.5,
            }}
          >
            {scan.warning
              ? "Audit detected non-compliance under Legal Metrology (Packaged Commodities) Rules, 2011 and FSSAI Packaging norms. You may file a grievance directly to your district enforcement office."
              : "Package satisfies all mandatory declarations under Section 36 of Legal Metrology Act, 2009. Net quantity, MRP inclusive of taxes, expiry dates, and manufacturer address are verified."}
          </p>
        </div>

        {/* Checklist Table */}
        <div>
          <h4
            style={{
              margin: "0 0 8px",
              fontSize: "15px",
              fontWeight: 800,
              color: "#201E1A",
            }}
          >
            Rule 6 Statutory Declarations Checklist
          </h4>
          <div style={{ overflowX: "auto" }}>
            <table className="sf-modal-table">
              <thead>
                <tr>
                  <th>Declaration Field</th>
                  <th>Finding / Detail</th>
                  <th style={{ textAlign: "right" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(scan.raw?.checklist || []).length > 0 ? (
                  scan.raw.checklist.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: "#0F172A" }}>
                        {item.label}
                      </td>
                      <td style={{ color: "#475569" }}>
                        {item.detail || item.rule || "Verified on packaging panel"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 800,
                            background:
                              item.status === "pass" ? "#DCFCE7" : "#FEE2E2",
                            color: item.status === "pass" ? "#166534" : "#991B1B",
                          }}
                        >
                          {item.status === "pass" ? "PASS" : "FAIL"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ fontWeight: 700 }}>
                      Mandatory PCR Declarations
                    </td>
                    <td style={{ color: "#475569" }}>
                      Package reviewed against Legal Metrology Act standards
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "9999px",
                          fontSize: "11px",
                          fontWeight: 800,
                          background: scan.warning ? "#FEE2E2" : "#DCFCE7",
                          color: scan.warning ? "#991B1B" : "#166534",
                        }}
                      >
                        {scan.warning ? "FAIL" : "PASS"}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "8px",
          }}
        >
          <button
            type="button"
            onClick={() => printTrustLabelPdf(scan)}
            className="sf-web-pill-secondary"
            style={{ fontSize: "12px", padding: "8px 16px" }}
          >
            <Download style={{ width: 14, height: 14 }} /> Print / Export PDF
            Audit Report
          </button>
          {scan.warning && (
            <Link
              to={portalHref("user", "complaints/new")}
              onClick={() => {
                if (onSelectScanForGrievance) onSelectScanForGrievance(scan);
                onClose();
              }}
              className="sf-web-pill-btn"
              style={{ fontSize: "12px", padding: "8px 16px" }}
            >
              <span>Lodge Official Grievance &rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
