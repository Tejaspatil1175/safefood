import React, { useRef, useState, useEffect } from "react";
import {
  ScanLine,
  Upload,
  CheckCircle2,
  X,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Camera,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { scansApi, type ScanItemResult } from "@/lib/api";
import { portalHref, mandatoryDeclarations } from "@/lib/safefood-demo";

interface CitizenScannerProps {
  onScanComplete?: (scanItem: any) => void;
}

export function CitizenScanner({ onScanComplete }: CitizenScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [scanResult, setScanResult] = useState<ScanItemResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const scanSteps = [
    "Uploading packaging image...",
    "Extracting OCR text & high-resolution label fields...",
    "Auditing Legal Metrology Rule 6 statutory declarations...",
    "Generating statutory compliance verdict & audit report...",
  ];

  // Cycle animation steps while scanning
  useEffect(() => {
    let timer: any;
    if (isScanning) {
      setScanStepIndex(0);
      timer = setInterval(() => {
        setScanStepIndex((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 900);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isScanning]);

  const handleFile = (file: File) => {
    if (!file) return;
    setSelectedFile(file);
    setErrorMessage(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Automatically trigger analysis
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

      if (onScanComplete) {
        const mappedScanItem = {
          id: res.id || (res as any)._id || `SF-${Date.now().toString().slice(-5)}`,
          product:
            res.productInfo?.productName ||
            res.product?.name ||
            file.name.replace(/\.[^/.]+$/, ""),
          category: res.productInfo?.brand ? `Brand: ${res.productInfo.brand}` : "Packaged Commodity",
          date: "Just now",
          result: res.isCompliant ? "Looks good" : "Check label",
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

  return (
    <div>
      <div className="sf-web-section-head">
        <div>
          <h3>Packaging Label Scanner & Metrology Audit</h3>
          <p>Upload any packaged food photo to run an automated Legal Metrology Rule 6 statutory audit</p>
        </div>
        <a href={portalHref("user", "dashboard")}>&larr; Back to Overview</a>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      <div className="sf-web-scanner-layout">
        {/* Left Column: Upload Target / Live Scanner / Preview */}
        <div className="sf-web-card">
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
                padding: "44px 24px",
                textAlign: "center",
                background: dragOver ? "rgba(211, 84, 0, 0.04)" : "#FAF5EA",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#FFFDF9",
                  border: "1px solid #E8DEC8",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 18px",
                  color: "#D35400",
                }}
              >
                <Upload style={{ width: 28, height: 28 }} />
              </div>
              <h4 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#201E1A" }}>
                Select or Drop Packaging Photo
              </h4>
              <p style={{ margin: "0 auto 18px", fontSize: 13, color: "#7A6F5D", maxWidth: 320 }}>
                Take a clear photo of the packaging label showing MRP, Net Weight, Manufacturer details, or Barcode.
              </p>
              <button
                type="button"
                className="sf-web-pill-btn"
                style={{ margin: "0 auto" }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Camera style={{ width: 16, height: 16 }} />
                <span>Upload Food Packaging Image</span>
              </button>
              <span style={{ display: "block", marginTop: 14, fontSize: 11, color: "#A89F91" }}>
                Supports JPG, PNG, WEBP up to 8MB
              </span>
            </div>
          )}

          {/* ACTIVE SCANNING LOADING STATE */}
          {isScanning && (
            <div className="sf-scanner-loading-box" style={{ margin: 0, padding: "40px 24px" }}>
              <div className="sf-loading-spinner-brand" style={{ width: 48, height: 48, borderWidth: 4 }} />
              <div style={{ marginTop: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#D35400",
                    fontWeight: 800,
                  }}
                >
                  AI Optical Metrology Scanner Active
                </span>
                <h4 style={{ margin: "6px 0 10px", fontSize: 18, color: "#FFFFFF", fontWeight: 800 }}>
                  Analyzing Packaging Label
                </h4>
                <p style={{ margin: "0 auto 16px", fontSize: 13, color: "#DCD5C5", maxWidth: 300 }}>
                  {scanSteps[scanStepIndex]}
                </p>
              </div>

              <div className="sf-scanning-pulse-bar" style={{ maxWidth: 280, height: 6 }}>
                <div className="sf-scanning-pulse-indicator" />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, textAlign: "left", width: "100%", maxWidth: 320 }}>
                {scanSteps.map((step, idx) => (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 12,
                      color: idx <= scanStepIndex ? (idx === scanStepIndex ? "#FAF5EA" : "#52B788") : "#7A6F5D",
                      fontWeight: idx === scanStepIndex ? 700 : 500,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: idx < scanStepIndex ? "#52B788" : idx === scanStepIndex ? "#D35400" : "#443F35",
                      }}
                    />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUDITED STATE (Photo Preview + Details) */}
          {!isScanning && scanResult && (
            <div>
              <div className="sf-web-viewfinder" style={{ position: "relative", overflow: "hidden" }}>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Packaging Scan"
                    style={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                      borderRadius: 12,
                      marginBottom: 14,
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                  />
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "#C5A059", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
                    Audited Commodity
                  </span>
                  <span
                    className={`sf-web-badge ${isCompliant ? "sf-web-badge-ok" : "sf-web-badge-warn"}`}
                    style={{ fontSize: 11 }}
                  >
                    {isCompliant ? "Passed All Standards" : "Statutory Breach Flagged"}
                  </span>
                </div>

                <strong style={{ display: "block", fontSize: "18px", color: "#FFFFFF", marginTop: 6 }}>
                  {productName}
                </strong>
                <span style={{ fontSize: "12px", color: "#C5A059" }}>
                  Brand: {brand} · Scan ID: {scanResult.id || "SF-AUDIT"}
                </span>
              </div>

              <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={resetScanner}
                  className="sf-web-pill-secondary"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  <RefreshCw style={{ width: 14, height: 14 }} />
                  <span>Scan Another Food Label</span>
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

        {/* Right Column: Statutory Rule 6 Declaration Checklist & Legal Findings */}
        <div className="sf-web-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 800 }}>
              Statutory Rule 6 Declaration Checklist
            </h4>
            <span
              className={`sf-web-badge ${
                scanResult
                  ? isCompliant
                    ? "sf-web-badge-ok"
                    : "sf-web-badge-warn"
                  : "sf-web-badge-neutral"
              }`}
            >
              {scanResult
                ? isCompliant
                  ? "All Declarations Passed"
                  : "Audit Failed"
                : "Awaiting Image"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {activeChecklist.map((decl) => (
              <div
                key={decl.label}
                className={`sf-web-checklist-item ${
                  scanResult && !decl.ok ? "sf-web-checklist-item-warn" : ""
                }`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {scanResult ? (
                    decl.ok ? (
                      <CheckCircle2 style={{ width: 18, height: 18, color: "#1E6B4A", flexShrink: 0 }} />
                    ) : (
                      <X style={{ width: 18, height: 18, color: "#C85A32", flexShrink: 0 }} />
                    )
                  ) : (
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: "1.5px solid #C5A059",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div>
                    <strong style={{ fontSize: "13px", color: "#201E1A", display: "block" }}>
                      {decl.label}
                    </strong>
                    <span style={{ fontSize: "11px", color: "#7A6F5D" }}>
                      {decl.detail}
                    </span>
                  </div>
                </div>

                <span
                  className={`sf-web-badge ${
                    scanResult
                      ? decl.ok
                        ? "sf-web-badge-ok"
                        : "sf-web-badge-warn"
                      : "sf-web-badge-neutral"
                  }`}
                >
                  {scanResult ? (decl.ok ? "PASS" : "FAIL") : "PENDING"}
                </span>
              </div>
            ))}
          </div>

          {/* Statutory Metrology Findings Note (NO GEMINI MENTION) */}
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
              Statutory Legal Metrology Findings:
            </strong>
            {scanResult ? (
              legalAdvice
            ) : (
              "Upload or take a photo of the packaged food commodity to extract mandatory declarations under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011 and evaluate compliance."
            )}
          </div>

          {scanResult && !isCompliant && (
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
    </div>
  );
}
