import React from 'react';
import Card from '../../components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { UserPlus, ShieldCheck } from 'lucide-react';

export const AdminOfficersPage = () => {
  const dummyOfficers = [
    { id: 'OFC-001', name: 'Inspector Priya Verma', email: 'officer@test.com', badge: 'LM-DEL-2024-884', zone: 'North Division', casesResolved: 31, status: 'active' },
    { id: 'OFC-002', name: 'Inspector Rajesh Kumar', email: 'rajesh.k@legalmetrology.gov.in', badge: 'LM-MUM-2023-112', zone: 'West Division', casesResolved: 45, status: 'active' },
    { id: 'OFC-003', name: 'Inspector Deepa Menon', email: 'deepa.m@legalmetrology.gov.in', badge: 'LM-BLR-2024-309', zone: 'South Division', casesResolved: 19, status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Enforcement Officers Directory
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Authorize Legal Metrology statutory officers and manage jurisdictional zone assignments.
          </p>
        </div>
        <Button variant="primary" icon={UserPlus}>
          Add Enforcement Officer
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Officer ID</TableHead>
              <TableHead>Officer Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Badge #</TableHead>
              <TableHead>Jurisdiction Zone</TableHead>
              <TableHead>Cases Closed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyOfficers.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary-700">
                  {o.id}
                </TableCell>
                <TableCell className="font-semibold text-neutral-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary-600" />
                  <span>{o.name}</span>
                </TableCell>
                <TableCell className="text-xs text-neutral-600">{o.email}</TableCell>
                <TableCell className="font-mono text-xs">{o.badge}</TableCell>
                <TableCell className="text-xs font-medium">{o.zone}</TableCell>
                <TableCell className="font-semibold text-neutral-800">{o.casesResolved}</TableCell>
                <TableCell>
                  <StatusBadge status={o.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminOfficersPage;
