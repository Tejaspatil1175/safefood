import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Send, Download } from "lucide-react";
import { portalHref } from "@/lib/safefood-demo";

interface CitizenComplaintsViewProps {
  isComplaintCreate: boolean;
  isComplaintDetail: boolean;
  complaintId?: string | undefined;
  complaints: any[];
  loadingComplaints: boolean;
  selectedScanItem: any;
  newComplaintDistrict: string;
  setNewComplaintDistrict: (d: string) => void;
  newComplaintStore: string;
  setNewComplaintStore: (s: string) => void;
  newComplaintNote: string;
  setNewComplaintNote: (n: string) => void;
  isSubmittingComplaint: boolean;
  complaintSubmitted: boolean;
  submittedComplaintId: string;
  onSubmitComplaint: (e: React.FormEvent) => void;
}

export function CitizenComplaintsView({
  isComplaintCreate,
  isComplaintDetail,
  complaintId,
  complaints,
  loadingComplaints,
  selectedScanItem,
  newComplaintDistrict,
  setNewComplaintDistrict,
  newComplaintStore,
  setNewComplaintStore,
  newComplaintNote,
  setNewComplaintNote,
  isSubmittingComplaint,
  complaintSubmitted,
  submittedComplaintId,
  onSubmitComplaint,
}: CitizenComplaintsViewProps) {
  const activeComplaint = complaints.find(
    (c) => c.id === complaintId || c.raw?._id === complaintId
  );

  return (
    <>
      {/* 1. Grievance Archive List */}
      {!isComplaintCreate && !isComplaintDetail && (
        <div>
          <div className="sf-web-section-head">
            <div>
              <h3>My Lodged Consumer Grievances</h3>
              <p>Legal Metrology (PCR 2011) complaints routed to District Food Safety Officers</p>
            </div>
            <Link to={portalHref("user", "complaints/new")}>+ Lodge New Grievance &rarr;</Link>
          </div>

          {loadingComplaints ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#7A6F5D" }}>
              Loading grievances from district database...
            </div>
          ) : complaints.length === 0 ? (
            <div className="sf-web-card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "#7A6F5D", margin: "0 0 16px" }}>
                No grievances lodged yet. If you scan a product with illegal tiny print or missing details, you can lodge a formal complaint here.
              </p>
              <Link to={portalHref("user", "complaints/new")} className="sf-web-pill-btn" style={{ margin: "0 auto" }}>
                <span>Lodge First Grievance</span>
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="sf-web-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#D35400" }}>
                      {c.id}
                    </span>
                    <h4 style={{ margin: "3px 0", fontSize: "18px", fontWeight: 800, color: "#201E1A" }}>
                      {c.product}
                    </h4>
                    <span style={{ fontSize: "12px", color: "#7A6F5D" }}>
                      {c.location} · Filed on {c.date}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "11px", color: "#7A6F5D", display: "block" }}>
                        Assigned Officer
                      </span>
                      <strong style={{ fontSize: "13px", color: "#201E1A" }}>{c.officer}</strong>
                    </div>

                    <span
                      className={`sf-web-badge ${
                        c.status === "RESOLVED" || c.status === "Resolved"
                          ? "sf-web-badge-ok"
                          : "sf-web-badge-warn"
                      }`}
                    >
                      {c.status}
                    </span>

                    <Link
                      to={portalHref("user", `complaints/${c.id}`)}
                      className="sf-web-pill-secondary"
                    >
                      View Timeline &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Lodge New Grievance Form */}
      {isComplaintCreate && (
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="sf-web-section-head">
            <div>
              <h3>Lodge a Legal Metrology (PCR 2011) Grievance</h3>
              <p>Report misleading food packaging directly to District Enforcement Officers</p>
            </div>
            <Link to={portalHref("user", "complaints")}>&larr; Cancel</Link>
          </div>

          {complaintSubmitted ? (
            <div className="sf-web-card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <CheckCircle2 style={{ width: 56, height: 56, color: "#1E6B4A", margin: "0 auto 16px" }} />
              <h3 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 800 }}>
                Grievance Registered in District Database
              </h3>
              <p style={{ color: "#5D5445", fontSize: "14px", maxWidth: 460, margin: "0 auto 24px" }}>
                Your grievance has been saved under Tracking ID{" "}
                <strong style={{ color: "#201E1A" }}>{submittedComplaintId}</strong> and routed to the{" "}
                <strong>{newComplaintDistrict}</strong> Legal Metrology Enforcement Cell.
              </p>
              <Link to={portalHref("user", "complaints")} className="sf-web-pill-btn" style={{ margin: "0 auto" }}>
                <span>Track Resolution Status</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmitComplaint} className="sf-web-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ padding: "16px", borderRadius: 12, background: "#FAF5EA", border: "1px solid #E8DEC8" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#D35400" }}>
                  Selected Inspection Evidence
                </span>
                <h4 style={{ margin: "4px 0 2px", fontSize: "17px", color: "#201E1A" }}>
                  {selectedScanItem?.product || "Packaged Food Product"}
                </h4>
                <p style={{ margin: 0, fontSize: "12px", color: "#7A6F5D" }}>
                  Evidence ID: {selectedScanItem?.id || "TL-ATTACHED"} · Violation: Packaging Declaration Non-Compliance
                </p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: 6 }}>
                  Jurisdiction District (Maharashtra)
                </label>
                <select
                  value={newComplaintDistrict}
                  onChange={(e) => setNewComplaintDistrict(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #DFD4BD",
                    background: "#FAF5EA",
                    fontSize: 14,
                    color: "#201E1A",
                    fontWeight: 600,
                  }}
                >
                  <option value="DHULE">Dhule District</option>
                  <option value="NANDURBAR">Nandurbar District</option>
                  <option value="JALGAON">Jalgaon District</option>
                  <option value="NASHIK">Nashik District</option>
                  <option value="MUMBAI">Mumbai City</option>
                  <option value="PUNE">Pune District</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: 6 }}>
                  Store / Retailer Name & Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mahavir Supermarket, Station Road, Dhule"
                  value={newComplaintStore}
                  onChange={(e) => setNewComplaintStore(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #DFD4BD",
                    background: "#FAF5EA",
                    fontSize: 14,
                    color: "#201E1A",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: 6 }}>
                  Grievance Details / Consumer Note
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain the statutory packaging violation (e.g., date of manufacture missing, smudged MRP, overcharging, missing consumer care contact)."
                  value={newComplaintNote}
                  onChange={(e) => setNewComplaintNote(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #DFD4BD",
                    background: "#FAF5EA",
                    fontSize: 14,
                    color: "#201E1A",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>

              <div
                style={{
                  background: "#FAF5EA",
                  border: "1px dashed #C5A059",
                  borderRadius: 12,
                  padding: "14px 18px",
                  fontSize: "12px",
                  color: "#7A6F5D",
                }}
              >
                📸 High-resolution packaging scan evidence and timestamp will be automatically attached to your formal complaint.
              </div>

              <button
                type="submit"
                className="sf-web-pill-btn"
                style={{ alignSelf: "flex-start" }}
                disabled={isSubmittingComplaint}
              >
                <span>{isSubmittingComplaint ? "Routing to Officer..." : "Submit Grievance to District Officer"}</span>
                <div className="sf-web-pill-arrow">
                  <Send style={{ width: 16, height: 16 }} />
                </div>
              </button>
            </form>
          )}
        </div>
      )}

      {/* 3. Single Complaint Timeline View */}
      {isComplaintDetail && activeComplaint && (
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div className="sf-web-section-head">
            <div>
              <h3>Grievance Case {activeComplaint.id}: {activeComplaint.product}</h3>
              <p>Official District Action Records from Database</p>
            </div>
            <Link to={portalHref("user", "complaints")}>&larr; Back to Grievances</Link>
          </div>

          <div className="sf-web-card" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                paddingBottom: 20,
                borderBottom: "1px solid #E8DEC8",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", color: "#7A6F5D", display: "block" }}>Location</span>
                <strong style={{ fontSize: "14px", color: "#201E1A" }}>{activeComplaint.location}</strong>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#7A6F5D", display: "block" }}>Assigned Officer</span>
                <strong style={{ fontSize: "14px", color: "#201E1A" }}>{activeComplaint.officer}</strong>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#7A6F5D", display: "block" }}>Current Status</span>
                <span className="sf-web-badge sf-web-badge-warn">{activeComplaint.status}</span>
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 10px", fontSize: "15px", color: "#201E1A" }}>Consumer Submission Statement</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#5D5445", background: "#FAF5EA", padding: 14, borderRadius: 10 }}>
                {activeComplaint.userNote || "Reported statutory labeling non-compliance under Legal Metrology Act PCR 2011."}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
