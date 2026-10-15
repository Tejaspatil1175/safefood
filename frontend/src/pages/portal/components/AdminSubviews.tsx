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
}

export function AdminComplaintsView({ reportsList }: AdminComplaintsViewProps) {
  return (
    <div className="sf-admin-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            All Filed Grievances & Statutory Audit Actions
          </h3>
          <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>
            Consumer reports filed under Legal Metrology Act, 2009 & PCR 2011 Rule 6.
          </p>
        </div>
        <span className="sf-admin-badge-pill sf-admin-badge-pill-red">
          {reportsList.length} Active Dockets
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
          </tr>
        </thead>
        <tbody>
          {reportsList.map((c: any, idx: number) => {
            const docket = c.complaintNumber || c.id || c._id || `#GRV-${idx + 101}`;
            const prod = c.product || c.productName || c.scan?.product?.name || "Packaged Product";
            const dateStr = c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "Today");
            const loc = c.location || `${c.district || "Dhule"}, MH`;

            return (
              <tr key={c.id || c._id || idx}>
                <td style={{ fontWeight: 700, color: "#0F172A" }}>{docket}</td>
                <td><strong>{prod}</strong></td>
                <td>{dateStr}</td>
                <td>{loc}</td>
                <td>Legal Metrology Decl. Missing</td>
                <td>
                  <span className="sf-admin-status-chip sf-admin-status-inprogress">
                    {c.status || "Under Review"}
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
            {officersFleet.map((officer: any, idx: number) => (
              <tr key={officer.id || idx}>
                <td>{officer.id}</td>
                <td><strong>{officer.name}</strong></td>
                <td>{officer.district}</td>
                <td>{officer.activeCases ?? 0}</td>
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

      <div className="sf-admin-card">
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
          Deploy Field Officer
        </h3>
        {officerAddedMessage && (
          <div style={{ background: "#DCFCE7", border: "1px solid #BBF7D0", borderRadius: 10, padding: 12, color: "#15803D", fontSize: 13, marginBottom: 14 }}>
            Officer deployed to district {newOfficerDistrict} via Districts API!
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
