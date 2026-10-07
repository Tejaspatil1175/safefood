import React from 'react';
import Card from '../../components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { Eye, ShieldAlert } from 'lucide-react';

export const AdminComplaintsPage = () => {
  const dummyAllComplaints = [
    { id: 'GRV-2026-089', commodity: 'Mustard Oil 500ml', violator: 'Kisan Naturals Ltd', complainant: 'Ramesh Sharma', officer: 'Insp. Priya Verma', status: 'under-review' },
    { id: 'GRV-2026-088', commodity: 'Basmati Rice 5kg', violator: 'FarmGold Agro', complainant: 'Citizen Flag', officer: 'Insp. Rajesh Kumar', status: 'pending' },
    { id: 'GRV-2026-042', commodity: 'Snack Pack 150g', violator: 'Urban Snacks Corp', complainant: 'Ananya Gupta', officer: 'Insp. Priya Verma', status: 'resolved' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            System Complaints & Grievances
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Global repository of all consumer non-compliance reports and statutory enforcement actions.
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Grievance ID</TableHead>
              <TableHead>Commodity</TableHead>
              <TableHead>Target Entity</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Assigned Officer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyAllComplaints.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary-700">
                  {c.id}
                </TableCell>
                <TableCell className="font-semibold text-neutral-900">{c.commodity}</TableCell>
                <TableCell>{c.violator}</TableCell>
                <TableCell className="text-xs text-neutral-600">{c.complainant}</TableCell>
                <TableCell className="text-xs font-medium">{c.officer}</TableCell>
                <TableCell>
                  <StatusBadge status={c.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" icon={Eye}>
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border">
          <Pagination currentPage={1} totalPages={8} totalItems={38} itemsPerPage={5} />
        </div>
      </Card>
    </div>
  );
};

export default AdminComplaintsPage;
