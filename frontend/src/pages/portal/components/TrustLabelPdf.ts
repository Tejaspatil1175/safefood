// Utility to print / download official TrustLabel™ Compliance Audit Reports

export function printTrustLabelPdf(scan: any) {
  try {
    const scanId = scan.id || `TL-${Date.now().toString().slice(-6)}`;
    const timestamp =
      scan.date ||
      new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    const isCompliant = scan.result === "Compliant" || !scan.warning;
    const raw = scan.raw || {};
    const checklist = raw.checklist || [];

    const checklistHtml = checklist.length
      ? checklist
          .map(
            (c: any) => `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px; font-weight: bold; color: #1e293b;">${c.label}</td>
            <td style="padding: 10px 12px; color: #475569; font-size: 13px;">${c.detail || c.rule || ""}</td>
            <td style="padding: 10px 12px; text-align: right;">
              <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: ${
                c.status === "pass" ? "#dcfce7; color: #166534;" : "#fee2e2; color: #991b1b;"
              }">
                ${c.status === "pass" ? "PASS" : "FAIL"}
              </span>
            </td>
          </tr>`
          )
          .join("")
      : `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 12px; font-weight: bold; color: #1e293b;">Rule 6 Declarations (MRP, Net Qty, Dates, FSSAI)</td>
          <td style="padding: 10px 12px; color: #475569; font-size: 13px;">Packaging statutory audit log under Legal Metrology Act, 2009</td>
          <td style="padding: 10px 12px; text-align: right;">
            <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: ${
              isCompliant ? "#dcfce7; color: #166534;" : "#fee2e2; color: #991b1b;"
            }">
              ${isCompliant ? "PASS" : "FAIL"}
            </span>
          </td>
        </tr>`;

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
            <div style="font-size: 15px; font-weight: bold; color: #0f172a;">${scan.product}</div>
          </div>
          <div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Identified Category / Brand</div>
            <div style="font-size: 15px; font-weight: bold; color: #0f172a;">${scan.category}</div>
          </div>
        </div>

        <div class="verdict-box">
          <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${isCompliant ? "#065f46" : "#991b1b"};">
            ${isCompliant ? "COMPLIANCE VERDICT: PASS (Rule 6 Certified)" : "COMPLIANCE VERDICT: STATUTORY VIOLATION FLAGGED"}
          </div>
          <div style="font-size: 13px; color: #334155; margin-top: 4px;">
            ${
              isCompliant
                ? "Package satisfies mandatory statutory declarations under Legal Metrology (Packaged Commodities) Rules 2011 and FSSAI standards. MRP, Net Quantity, and Manufacturer details are verified."
                : "Under Section 36 of the Legal Metrology Act, 2009 and PCR 2011 Rule 6(1), manufacturing, packing, or distributing packaged food without all statutory declarations is a punishable breach subject to compounding or seizure."
            }
          </div>
        </div>

        <h3>PCR 2011 Statutory Declarations Audit Checklist</h3>
        <table>
          <thead>
            <tr>
              <th>Mandatory Declaration</th>
              <th>Statutory Requirement / Finding</th>
              <th style="text-align: right;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${checklistHtml}
          </tbody>
        </table>

        <div class="footer">
          Generated autonomously by TrustLabel™ Optical Compliance Engine · Official Verification Record
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  } catch (e) {
    console.error("PDF generation error:", e);
    alert("Failed to open print report window.");
  }
}
