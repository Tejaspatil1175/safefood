import React from 'react';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';

export const UserComplaintsPage = () => {
  const dummyComplaints = [
    {
      id: 'GRV-2026-089',
      subject: 'Missing Unit Sale Price & Incomplete Net Weight',
      brand: 'Kisan Naturals (Mustard Oil)',
      dateFiled: 'Oct 04, 2026',
      status: 'under-review',
      officer: 'Officer Assigned',
    },
    {
      id: 'GRV-2026-042',
      subject: 'Dual MRP Sticker Violation',
      brand: 'Urban Snacks Corp',
      dateFiled: 'Sep 15, 2026',
      status: 'resolved',
      officer: 'Notice Issued',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            My Complaints & Grievances
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Track Legal Metrology non-compliance grievances submitted to statutory enforcement cells.
          </p>
        </div>
        <Button variant="primary" icon={PlusCircle}>
          File New Grievance
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Grievance ID</TableHead>
              <TableHead>Violation Subject</TableHead>
              <TableHead>Entity / Brand</TableHead>
              <TableHead>Date Filed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enforcement Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyComplaints.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary-700">
                  {c.id}
                </TableCell>
                <TableCell className="font-medium text-neutral-900">{c.subject}</TableCell>
                <TableCell>{c.brand}</TableCell>
                <TableCell className="text-xs text-neutral-500">{c.dateFiled}</TableCell>
                <TableCell>
                  <StatusBadge status={c.status} size="sm" />
                </TableCell>
                <TableCell className="text-xs font-medium text-neutral-700">
                  {c.officer}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default UserComplaintsPage;
