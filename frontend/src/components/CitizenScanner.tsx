import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ScanLine,
  Upload,
  CheckCircle2,
  X,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Camera,
  RefreshCw,
  Download,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { scansApi, type ScanItemResult } from "@/lib/api";
import { portalHref, mandatoryDeclarations } from "@/lib/safefood-demo";

interface CitizenScannerProps {
  onScanComplete?: (scanItem: any) => void;
}

export function CitizenScanner({ onScanComplete }: CitizenScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerTopRef = useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [scanResult, setScanResult] = useState<ScanItemResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const scanSteps = [
    "Uploading packaging image to TrustLabel™ AI Engine...",
    "Extracting optical text, batch numbers & Net Quantity declarations...",
    "Verifying PCR 2011 Rule 6 mandatory statutory font heights...",
    "Generating TrustLabel™ certified compliance scorecard...",
  ];

  // Cycle animation steps while scanning
  useEffect(() => {
    let timer: any;
    if (isScanning) {
      setScanStepIndex(0);
      timer = setInterval(() => {
        setScanStepIndex((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 850);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isScanning]);

  const scrollToScannerTop = () => {
    if (scannerTopRef.current) {
      scannerTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFile = (file: File) => {
    if (!file) return;
    setSelectedFile(file);
    setErrorMessage(null);

    // Auto scroll up smoothly to top
    scrollToScannerTop();

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Trigger analysis
    runScanUpload(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const runScanUpload = async (file: File) => {
    setIsScanning(true);
    setErrorMessage(null);
    setScanResult(null);

    const formData = new FormData();
    formData.append("images", file);
    formData.append("label", file);

    try {
      const res = await scansApi.create(formData);
      setScanResult(res);

      // Auto scroll smoothly to keep top in view
      setTimeout(scrollToScannerTop, 80);

      if (onScanComplete) {
        const mappedScanItem = {
          id: res.id || (res as any)._id || `TL-${Date.now().toString().slice(-5)}`,
          product:
            res.productInfo?.productName ||
            res.product?.name ||
            file.name.replace(/\.[^/.]+$/, ""),
          category: res.productInfo?.brand ? `Brand: ${res.productInfo.brand}` : "Packaged Commodity",
          date: "Just now",
          result: res.isCompliant ? "Compliant" : "Violation Flagged",
          warning: !res.isCompliant,
        };
        onScanComplete(mappedScanItem);
      }
    } catch (err: any) {
      console.warn("Scan upload notice:", err);
      setErrorMessage(
        err?.message || "Failed to process image. Please try again with a clearer photo of the label."
      );
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    scrollToScannerTop();
  };

  // Build display checklist from scanResult or fallback declarations
  const activeChecklist = scanResult?.checklist?.length
    ? scanResult.checklist.map((item) => ({
        label: item.label,
        ok: item.status === "pass",
        detail: item.detail,
        status: item.status === "pass" ? "PASS" : "FAIL",
      }))
    : mandatoryDeclarations.map((item) => ({
        label: item.label,
        ok: scanResult ? scanResult.isCompliant : true,
        detail: item.detail,
        status: scanResult ? (scanResult.isCompliant ? "PASS" : "FAIL") : "READY",
      }));

  const productName =
    scanResult?.productInfo?.productName ||
    scanResult?.product?.name ||
    (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Packaged Commodity");

  const brand =
    scanResult?.productInfo?.brand ||
    scanResult?.product?.brand ||
    "Identified Product";

  const isCompliant = scanResult?.isCompliant ?? false;
  const legalAdvice =
    (scanResult as any)?.report?.actionableAdvice ||
    ((scanResult as any)?.geminiAudit?.summary) ||
    (!isCompliant
      ? "Under Section 36 of the Legal Metrology Act, 2009 and PCR 2011 Rule 6(1), manufacturing, packing, or distributing packaged food without all statutory declarations is a punishable breach subject to compounding or seizure."
      : "Package satisfies all mandatory statutory declarations under Legal Metrology (Packaged Commodities) Rules 2011 and FSSAI standards. MRP, Net Quantity, and Manufacturer details are verified.");

  // Printable and downloadable TrustLabel PDF report generator
  const downloadTrustLabelPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const scanId = scanResult?.id || `TL-${Date.now().toString().slice(-6)}`;
      const timestamp = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

      const checklistHtml = activeChecklist
        .map(
          (c) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 12px; font-weight: bold; color: #1e293b;">${c.label}</td>
          <td style="padding: 10px 12px; color: #475569; font-size: 13px;">${c.detail}</td>
          <td style="padding: 10px 12px; text-align: right;">
            <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: ${
              c.ok ? "#dcfce7; color: #166534;" : "#fee2e2; color: #991b1b;"
            }">
              ${c.ok ? "PASS" : "FAIL"}
            </span>
          </td>
        </tr>`
        )
        .join("");

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups in your browser to download or print your TrustLabel PDF report.");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>TrustLabel Compliance Audit Report - ${scanId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 36px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #065f46; padding-bottom: 18px; margin-bottom: 22px; }
            .brand-logo { font-size: 24px; font-weight: 800; color: #065f46; letter-spacing: -0.02em; }
            .brand-sub { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
            .meta-box { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
            .verdict-box { padding: 16px; border-radius: 10px; margin-bottom: 20px; background: ${
              isCompliant ? "#ecfdf5; border: 1.5px solid #a7f3d0;" : "#fff1f2; border: 1.5px solid #fecdd3;"
            }; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 22px; font-size: 13px; }
            th { text-align: left; padding: 10px 12px; background: #f1f5f9; font-size: 12px; text-transform: uppercase; color: #475569; }
            .footer { margin-top: 36px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
            @media print { body { margin: 16px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand-logo">TrustLabel™ Official Metrology Audit</div>
              <div class="brand-sub">India Legal Metrology (PCR 2011) & FSSAI Packaging Compliance</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold; font-size: 14px; color: #0f172a;">Audit Report: ${scanId}</div>
              <div style="font-size: 12px; color: #64748b;">${timestamp}</div>
            </div>
          </div>

          <div class="meta-box">
            <div>
              <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Audited Commodity</div>
              <div style="font-size: 15px; font-weight: bold; color: #0f172a;">${productName}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Identified Brand</div>
              <div style="font-size: 15px; font-weight: bold; color: #0f172a;">${brand}</div>
            </div>
          </div>

          <div class="verdict-box">
            <h3 style="margin: 0 0 6px; font-size: 15px; font-weight: bold; color: ${isCompliant ? "#166534" : "#991b1b"};">
              ${isCompliant ? "STATUTORY COMPLIANCE STATUS: VERIFIED COMPLIANT (PASS)" : "STATUTORY COMPLIANCE STATUS: VIOLATION DETECTED (FAIL)"}
            </h3>
            <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.5;">${legalAdvice}</p>
          </div>

          <h3 style="font-size: 15px; margin: 0 0 10px; color: #0f172a;">Legal Metrology PCR Rule 6 Mandatory Checklist</h3>
          <table>
            <thead>
              <tr>
                <th>Mandatory Declaration</th>
                <th>Extracted Detail</th>
                <th style="text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${checklistHtml}
            </tbody>
          </table>

          <div class="footer">
            Generated via TrustLabel™ Automated Legal Metrology Inspection Platform. Certified for statutory consumer protection and district enforcement audit records.
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 400);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div ref={scannerTopRef} style={{ maxWidth: 1040, margin: "0 auto", paddingTop: 32, paddingBottom: 48 }}>
      {/* Editorial Header */}
      <div className="sf-web-section-head" style={{ marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#D35400",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Sparkles style={{ width: 13, height: 13 }} />
              TrustLabel™ Optical Metrology Engine
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#201E1A" }}>
            Packaged Food Compliance Scanner
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#7A6F5D" }}>
            Instant optical inspection under Legal Metrology (Packaged Commodities) Rules 2011 & FSSAI regulations.
          </p>
        </div>
        <Link to={portalHref("user", "dashboard")} className="sf-web-pill-secondary" style={{ fontSize: 12, padding: "6px 14px" }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      {/* Main Scanner Container */}
      <div style={{ display: "grid", gridTemplateColumns: scanResult ? "1fr 1fr" : "1fr", gap: 24, transition: "all 0.3s ease" }}>
        {/* Left Column: Upload / Viewfinder / Scan Result Visualizer */}
        <div className="sf-web-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!previewUrl && !isScanning && !scanResult && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "#D35400" : "#C5A059"}`,
                borderRadius: 20,
                padding: "48px 24px",
                textAlign: "center",
                background: dragOver ? "rgba(211, 84, 0, 0.06)" : "#FAF5EA",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: "#FFFDF9",
                  border: "1.5px solid #E8DEC8",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                  color: "#D35400",
                  boxShadow: "0 6px 16px rgba(211, 84, 0, 0.12)",
                }}
              >
                <ScanLine style={{ width: 32, height: 32 }} />
              </div>
              <h4 style={{ margin: "0 0 6px", fontSize: 19, fontWeight: 800, color: "#201E1A" }}>
                Select or Drop Packaging Photo
              </h4>
              <p style={{ margin: "0 auto 20px", fontSize: 13, color: "#7A6F5D", maxWidth: 380, lineHeight: 1.5 }}>
                Capture front or back panel showing <strong>MRP, Net Quantity, Expiry, or Manufacturer</strong> details.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="sf-web-pill-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload style={{ width: 16, height: 16 }} />
                  <span>Choose Photo / File</span>
                </button>

                <button
                  type="button"
                  className="sf-web-pill-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute("capture", "environment");
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <Camera style={{ width: 15, height: 15 }} />
                  <span>Use Device Camera</span>
                </button>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #E8DEC8", display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", fontSize: 12, color: "#7A6F5D" }}>
                <span>🛡️ AI Optical OCR</span>
                <span>⚖️ PCR 2011 Verified</span>
                <span>📄 Instant PDF Report</span>
              </div>
            </div>
          )}

          {/* ACTIVE SCANNING WITH LIVE LASER SWEEP */}
          {isScanning && (
            <div className="sf-web-viewfinder" style={{ padding: "48px 24px" }}>
              <div className="sf-web-viewfinder-scanline" />
              <div className="sf-loading-spinner-brand" style={{ width: 48, height: 48, margin: "0 auto 18px" }} />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#D35400",
                  fontWeight: 800,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                TrustLabel™ Optical Laser Active
              </span>
              <h4 style={{ margin: "0 0 10px", color: "#FAF5EA", fontSize: 20, fontWeight: 800 }}>
                Auditing Packaging Declarations...
              </h4>
              <div style={{ color: "#C5A059", fontSize: 13, minHeight: 22, fontWeight: 600 }}>
                {scanSteps[scanStepIndex]}
              </div>
            </div>
          )}

          {/* AUDITED PRODUCT RESULT PREVIEW */}
          {previewUrl && scanResult && (
            <div>
              <div
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1.5px solid #E8DEC8",
                  background: "#201E1A",
                  maxHeight: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={previewUrl}
                  alt="Packaging preview"
                  style={{ maxWidth: "100%", maxHeight: 320, objectFit: "contain", display: "block" }}
                />
              </div>

              <div
                style={{
                  marginTop: 14,
                  background: "#201E1A",
                  color: "#FAF5EA",
                  borderRadius: 14,
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#C5A059",
                      fontWeight: 800,
                    }}
                  >
                    TrustLabel™ Certified Audit
                  </span>
                  <span
                    className={`sf-web-badge ${isCompliant ? "sf-web-badge-ok" : "sf-web-badge-warn"}`}
                  >
                    {isCompliant ? "Certified Compliant" : "Violation Flagged"}
                  </span>
                </div>

                <strong style={{ display: "block", fontSize: "19px", color: "#FFFFFF" }}>
                  {productName}
                </strong>
                <span style={{ fontSize: "12px", color: "#C5A059" }}>
                  Category: {brand} · Audit ID: {scanResult.id || "TL-LIVE"}
                </span>
              </div>

              {/* Action Buttons: Scan Another Label & Download PDF */}
              <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={resetScanner}
                  className="sf-web-pill-secondary"
                  style={{ flex: 1, justifyContent: "center", minWidth: 160 }}
                >
                  <RefreshCw style={{ width: 14, height: 14 }} />
                  <span>Scan Another Food Pack</span>
                </button>

                <button
                  type="button"
                  onClick={downloadTrustLabelPdf}
                  disabled={isGeneratingPdf}
                  className="sf-web-pill-btn"
                  style={{ flex: 1, justifyContent: "center", minWidth: 160 }}
                >
                  <Download style={{ width: 14, height: 14 }} />
                  <span>{isGeneratingPdf ? "Generating..." : "Download TrustLabel™ PDF"}</span>
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                marginTop: 14,
                padding: "12px 16px",
                borderRadius: 12,
                background: "#FDF2E9",
                border: "1px solid #F5C6CB",
                color: "#C85A32",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0 }} />
              <div>{errorMessage}</div>
            </div>
          )}
        </div>

        {/* Right Column: Rule 6 Declaration Checklist & Legal Metrology Findings (Shown after scan) */}
        {scanResult && (
          <div className="sf-web-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E8DEC8", paddingBottom: 12 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#201E1A" }}>
                  Rule 6 Statutory Checklist
                </h4>
                <span style={{ fontSize: "11px", color: "#7A6F5D" }}>Legal Metrology Act, 2009 PCR standards</span>
              </div>
              <span
                className={`sf-web-badge ${
                  isCompliant ? "sf-web-badge-ok" : "sf-web-badge-warn"
                }`}
              >
                {isCompliant ? "All Declarations Passed" : "Breach Detected"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
              {activeChecklist.map((decl) => (
                <div
                  key={decl.label}
                  className={`sf-web-checklist-item ${
                    !decl.ok ? "sf-web-checklist-item-warn" : ""
                  }`}
                  style={{ padding: "10px 14px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {decl.ok ? (
                      <CheckCircle2 style={{ width: 18, height: 18, color: "#1E6B4A", flexShrink: 0 }} />
                    ) : (
                      <X style={{ width: 18, height: 18, color: "#C85A32", flexShrink: 0 }} />
                    )}
                    <div>
                      <strong style={{ fontSize: "13px", color: "#201E1A", display: "block" }}>
                        {decl.label}
                      </strong>
                      <span style={{ fontSize: "11px", color: "#7A6F5D", lineHeight: 1.4, display: "block" }}>
                        {decl.detail}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`sf-web-badge ${
                      decl.ok ? "sf-web-badge-ok" : "sf-web-badge-warn"
                    }`}
                  >
                    {decl.ok ? "PASS" : "FAIL"}
                  </span>
                </div>
              ))}
            </div>

            {/* Statutory Metrology Findings Note */}
            <div
              style={{
                background: "#FAF5EA",
                border: "1px solid #E8DEC8",
                borderRadius: 14,
                padding: "16px",
                fontSize: "12px",
                lineHeight: 1.6,
                color: "#5D5445",
              }}
            >
              <strong style={{ color: "#201E1A", display: "block", marginBottom: 4 }}>
                <ShieldCheck
                  style={{
                    width: 15,
                    height: 15,
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: 6,
                    color: "#D35400",
                  }}
                />
                TrustLabel™ Statutory Metrology Findings:
              </strong>
              {legalAdvice}
            </div>

            {/* Action Row */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
              <button
                type="button"
                onClick={downloadTrustLabelPdf}
                className="sf-web-pill-secondary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Download style={{ width: 16, height: 16 }} />
                <span>Download Official TrustLabel™ PDF Audit Report</span>
              </button>

              {!isCompliant && (
                <a
                  href={portalHref("user", "complaints/new")}
                  className="sf-web-pill-btn"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <span>Lodge Official Grievance with this Scan</span>
                  <div className="sf-web-pill-arrow">
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </div>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
