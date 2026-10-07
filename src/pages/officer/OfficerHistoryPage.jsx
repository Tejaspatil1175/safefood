import React from 'react';
import Card from '../../components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { Eye, FileDown } from 'lucide-react';

export const OfficerHistoryPage = () => {
  const dummyHistory = [
    { id: 'OFC-901', product: 'Packaged Drinking Water 1L', outlet: 'City Mart #4', date: 'Oct 07, 2026', violations: 'Font size below 4mm', status: 'non-compliant' },
    { id: 'OFC-900', product: 'Refined Sugar 1kg', outlet: 'Royal Provision Stores', date: 'Oct 06, 2026', violations: 'None', status: 'compliant' },
    { id: 'OFC-899', product: 'Imported Energy Drink 250ml', outlet: 'Express Fuel Station #12', date: 'Oct 05, 2026', violations: 'Missing country of origin', status: 'warning' },
    { id: 'OFC-898', product: 'Detergent Powder 2kg', outlet: 'Mega Hypermarket', date: 'Oct 03, 2026', violations: 'Net wt 1.82kg (-180g error)', status: 'non-compliant' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Field Inspection & Scan History
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Historical log of statutory inspections, OCR audits, and non-compliance memos.
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Inspection ID</TableHead>
              <TableHead>Sampled Commodity</TableHead>
              <TableHead>Retailer / Outlet</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Key Findings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyHistory.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary-700">
                  {row.id}
                </TableCell>
                <TableCell className="font-medium text-neutral-900">{row.product}</TableCell>
                <TableCell>{row.outlet}</TableCell>
                <TableCell className="text-xs text-neutral-500">{row.date}</TableCell>
                <TableCell className="text-xs text-neutral-600">{row.violations}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="ghost" size="sm" icon={Eye}>
                      Audit
                    </Button>
                    <Button variant="ghost" size="sm" icon={FileDown} aria-label="Export memo" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border">
          <Pagination currentPage={1} totalPages={4} totalItems={20} itemsPerPage={5} />
        </div>
      </Card>
    </div>
  );
};

export default OfficerHistoryPage;
