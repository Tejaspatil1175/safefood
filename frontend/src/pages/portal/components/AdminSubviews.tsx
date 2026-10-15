import React from "react";
import { ArrowRight } from "lucide-react";
import { sampleScans } from "@/lib/safefood-demo";

interface AdminProductsViewProps {
  liveScansList: any[];
}

export function AdminProductsView({ liveScansList }: AdminProductsViewProps) {
  return (
    <div className="sf-admin-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            Packaged Food Products Compliance Registry
          </h3>
          <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>
            Live audited commodity database inspected under PCR 2011 & FSSAI regulations.
          </p>
        </div>
        <span className="sf-admin-badge-pill sf-admin-badge-pill-green">
          {liveScansList.length} Live Database Items
        </span>
      </div>
      <table className="sf-admin-table">
        <thead>
          <tr>
            <th>Audit ID</th>
            <th>Product Name</th>
            <th>Manufacturer / Brand</th>
            <th>Net Quantity / Barcode</th>
            <th>Compliance Verdict</th>
          </tr>
        </thead>
        <tbody>
          {liveScansList.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "36px 16px", color: "#64748B" }}>
                Loading live audited food products from MongoDB...
              </td>
            </tr>
          ) : (
            liveScansList.map((s: any, idx: number) => {
              const idStr = s._id ? `#AUD-${s._id.slice(-6).toUpperCase()}` : (s.id ? `#AUD-${s.id.slice(-6).toUpperCase()}` : `#AUD-${idx + 101}`);
              const nameStr =
                s.productInfo?.productName ||
                s.product?.name ||
                s.detectedProduct?.productName ||
                s.productName ||
                "Packaged Food Item";
              const brandStr =
                s.productInfo?.brand ||
                s.productInfo?.manufacturer ||
                s.product?.brand ||
                s.detectedProduct?.brand ||
                "Brand / Manufacturer";
              const netQtyStr =
                s.productInfo?.netQuantity ||
                (s.product?.netQuantity ? `${s.product.netQuantity.value} ${s.product.netQuantity.unit}` : null) ||
                s.productInfo?.barcode ||
                "Declared on Pack";
              const isWarning = s.isCompliant === false || s.verdict === "FAIL" || s.warning;
              const score = s.complianceScore ?? s.score ?? (isWarning ? 38 : 95);

              return (
                <tr key={s._id || s.id || idx}>
                  <td style={{ fontWeight: 700, color: "#0F172A" }}>{idStr}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>🥫</span>
                      <strong>{nameStr}</strong>
                    </div>
                  </td>
                  <td>{brandStr}</td>
                  <td style={{ color: "#64748B", fontSize: 12 }}>{netQtyStr}</td>
                  <td>
                    <span className={`sf-admin-badge-pill ${isWarning ? "sf-admin-badge-pill-red" : "sf-admin-badge-pill-green"}`}>
                      {isWarning ? `Violations Flagged (${score}%)` : `100% Compliant (${score}%)`}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

interface AdminComplaintsViewProps {
  reportsList: any[];
  onUpdateReportStatus?: (reportId: string, newStatus: string) => void;
}

export function AdminComplaintsView({ reportsList, onUpdateReportStatus }: AdminComplaintsViewProps) {
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleAction = async (reportId: string, status: string) => {
    if (!onUpdateReportStatus) return;
    setUpdatingId(reportId);
    try {
      await onUpdateReportStatus(reportId, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="sf-admin-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            All Filed Grievances & Statutory Audit Actions
          </h3>
          <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>
            Review, verify, and resolve consumer reports filed under Legal Metrology Act, 2009 & PCR 2011.
          </p>
        </div>
        <span className="sf-admin-badge-pill sf-admin-badge-pill-red">
          {reportsList.length} Total Dockets
        </span>
      </div>
      <table className="sf-admin-table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Product Name</th>
            <th>Date</th>
            <th>Jurisdiction</th>
            <th>Violation Type</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Administrative Action</th>
          </tr>
        </thead>
        <tbody>
          {reportsList.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "36px 16px", color: "#64748B" }}>
                No active complaints filed in the database.
              </td>
            </tr>
          ) : (
            reportsList.map((c: any, idx: number) => {
              const docket = c.complaintNumber || c.id || c._id || `#GRV-${idx + 101}`;
              const reportId = c._id || c.id;
              const prod = c.product || c.productName || c.scan?.product?.name || "Packaged Product";
              const dateStr = c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "Today");
              const loc = c.location || `${c.district || "Dhule"}, MH`;
              const statusStr = c.status || "IN_REVIEW";
              const isDone = statusStr === "ACTION_TAKEN" || statusStr === "VERIFIED" || statusStr === "VALID";

              return (
                <tr key={reportId || idx}>
                  <td style={{ fontWeight: 700, color: "#0F172A" }}>{docket}</td>
                  <td><strong>{prod}</strong></td>
                  <td>{dateStr}</td>
                  <td>{loc}</td>
                  <td>Legal Metrology Decl. Missing</td>
                  <td>
                    <span
                      className={`sf-admin-status-chip ${
                        isDone
                          ? "sf-admin-status-complete"
                          : statusStr === "REJECTED"
                          ? "sf-admin-status-waiting"
                          : "sf-admin-status-inprogress"
                      }`}
                    >
                      {statusStr}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {statusStr !== "ACTION_TAKEN" ? (
                        <button
                          type="button"
                          className="sf-admin-btn-outline"
                          disabled={updatingId === reportId}
                          onClick={() => handleAction(reportId, "ACTION_TAKEN")}
                          style={{
                            background: "#0F172A",
                            color: "#FFFFFF",
                            padding: "6px 12px",
                            fontSize: 12,
                            borderRadius: 8,
                            cursor: "pointer",
                            border: "none",
                            fontWeight: 600,
                          }}
                        >
                          {updatingId === reportId ? "Updating..." : "Mark Done ✓"}
                        </button>
                      ) : (
                        <span style={{ color: "#16A34A", fontSize: 12, fontWeight: 700 }}>
                          Resolved ✓
                        </span>
                      )}

                      {statusStr !== "VERIFIED" && statusStr !== "ACTION_TAKEN" && (
                        <button
                          type="button"
                          className="sf-admin-btn-outline"
                          disabled={updatingId === reportId}
                          onClick={() => handleAction(reportId, "VERIFIED")}
                          style={{
                            background: "#F1F5F9",
                            color: "#0F172A",
                            padding: "6px 10px",
                            fontSize: 11,
                            borderRadius: 8,
                            cursor: "pointer",
                            border: "1px solid #CBD5E1",
                            fontWeight: 600,
                          }}
                        >
                          Verify
                        </button>
                      )}

                      {statusStr !== "REJECTED" && (
                        <button
                          type="button"
                          disabled={updatingId === reportId}
                          onClick={() => handleAction(reportId, "REJECTED")}
                          style={{
                            background: "transparent",
                            color: "#EF4444",
                            padding: "6px 8px",
                            fontSize: 11,
                            borderRadius: 8,
                            cursor: "pointer",
                            border: "none",
                            fontWeight: 600,
                          }}
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

interface AdminOfficersViewProps {
  officersFleet: any[];
  newOfficerName: string;
  setNewOfficerName: (v: string) => void;
  newOfficerDistrict: string;
  setNewOfficerDistrict: (v: string) => void;
  officerAddedMessage: boolean;
  handleDeployOfficer: (e: React.FormEvent) => void;
}

export function AdminOfficersView({
  officersFleet,
  newOfficerName,
  setNewOfficerName,
  newOfficerDistrict,
  setNewOfficerDistrict,
  officerAddedMessage,
  handleDeployOfficer,
}: AdminOfficersViewProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
      <div className="sf-admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              Enforcement Fleet Directory
            </h3>
            <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>
              Authorized Legal Metrology & FSSAI field inspection officers in active service.
            </p>
          </div>
          <span className="sf-admin-badge-pill sf-admin-badge-pill-green">
            {officersFleet.length} Active Officers
          </span>
        </div>

        {officersFleet.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748B" }}>
            <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600 }}>No field officers deployed yet.</p>
            <p style={{ margin: 0, fontSize: 12 }}>Use the deployment console on the right to assign an enforcement officer to a district.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="sf-admin-table">
              <thead>
                <tr>
                  <th>Officer ID</th>
                  <th>Name & Credentials</th>
                  <th>Jurisdiction</th>
                  <th>Active Cases</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {officersFleet.map((officer: any, idx: number) => (
                  <tr key={officer.id || idx}>
                    <td style={{ fontWeight: 700, color: "#0F172A" }}>{officer.id}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong style={{ color: "#0F172A" }}>{officer.name}</strong>
                        {officer.email && (
                          <span style={{ fontSize: 11, color: "#64748B" }}>{officer.email}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ display: "inline-block", padding: "2px 8px", background: "#F1F5F9", borderRadius: 4, fontSize: 12, fontWeight: 600, color: "#334155" }}>
                        {officer.district}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "#0F172A" }}>{officer.activeCases ?? 0}</td>
                    <td>
                      <span className={`sf-admin-status-chip ${officer.status?.includes('Active') ? 'sf-admin-status-complete' : 'sf-admin-status-waiting'}`}>
                        {officer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="sf-admin-card">
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
          Deploy Field Officer
        </h3>
        <p style={{ margin: "0 0 16px", color: "#64748B", fontSize: 13 }}>
          Commission a certified enforcement officer and provision database credentials.
        </p>

        {officerAddedMessage && (
          <div style={{ background: "#DCFCE7", border: "1px solid #BBF7D0", borderRadius: 10, padding: 12, color: "#15803D", fontSize: 13, marginBottom: 14 }}>
            ✓ Field officer successfully commissioned and assigned to district!
          </div>
        )}
        <form
          onSubmit={handleDeployOfficer}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="sf-demo-field">
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Officer Full Name</label>
            <input
              type="text"
              required
              style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1", outline: "none", fontSize: 13 }}
              value={newOfficerName}
              onChange={(e) => setNewOfficerName(e.target.value)}
              placeholder="e.g. Inspector Anil Shinde"
            />
          </div>
          <div className="sf-demo-field">
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Assigned District Jurisdiction</label>
            <select
              style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1", outline: "none", fontSize: 13 }}
              value={newOfficerDistrict}
              onChange={(e) => setNewOfficerDistrict(e.target.value)}
            >
              <option value="DHULE">DHULE</option>
              <option value="PUNE">PUNE</option>
              <option value="MUMBAI">MUMBAI</option>
              <option value="NASHIK">NASHIK</option>
              <option value="NAGPUR">NAGPUR</option>
              <option value="AURANGABAD">AURANGABAD</option>
            </select>
          </div>
          <button
            type="submit"
            className="sf-admin-btn-outline"
            style={{ background: "#0F172A", color: "#FFFFFF", justifyContent: "center", marginTop: 8, padding: "10px 16px", cursor: "pointer", border: "none" }}
          >
            <span>Commission & Deploy Officer</span>
            <ArrowRight style={{ width: 14, height: 14 }} />
          </button>
        </form>
      </div>
    </div>
  );
}

interface AdminUsersViewProps {
  citizensList: any[];
}

export function AdminUsersView({ citizensList }: AdminUsersViewProps) {
  const displayUsers = citizensList;

  return (
    <div className="sf-admin-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            Citizen Consumer Directory
          </h3>
          <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>
            Registered citizens actively auditing packaged foods and reporting statutory breaches.
          </p>
        </div>
        <span className="sf-admin-badge-pill sf-admin-badge-pill-green">
          {citizensList.length > 0 ? `${citizensList.length} Active Accounts` : "Live DB"}
        </span>
      </div>
      <table className="sf-admin-table">
        <thead>
          <tr>
            <th>Citizen ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>District / State</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayUsers.map((u: any, idx: number) => {
            const citId = u._id ? `#CIT-${u._id.slice(-4).toUpperCase()}` : `#CIT-${idx + 401}`;
            const locStr = `${u.district || "Dhule"}, ${u.state || "MH"}`;
            return (
              <tr key={u._id || idx}>
                <td style={{ fontWeight: 700, color: "#0F172A" }}>{citId}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#E2E8F0",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        fontSize: 12,
                        color: "#334155",
                      }}
                    >
                      {(u.name || "C")[0].toUpperCase()}
                    </div>
                    <strong>{u.name || "Citizen User"}</strong>
                  </div>
                </td>
                <td style={{ color: "#64748B", fontSize: 13 }}>{u.email}</td>
                <td>{locStr}</td>
                <td>
                  <span style={{ textTransform: "capitalize", fontWeight: 600, fontSize: 12 }}>
                    {u.role === "admin" ? "Administrator" : u.role === "officer" ? "Field Officer" : "Citizen"}
                  </span>
                </td>
                <td>
                  <span className={`sf-admin-status-chip ${u.isActive !== false ? "sf-admin-status-complete" : "sf-admin-status-inprogress"}`}>
                    {u.isActive !== false ? "Active Verified" : "Pending"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
