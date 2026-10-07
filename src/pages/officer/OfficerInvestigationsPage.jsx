import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import { CheckSquare, AlertCircle } from 'lucide-react';

export const OfficerInvestigationsPage = () => {
  const dummyCases = [
    {
      id: 'INV-402',
      product: 'Sunrise Sunflower Oil 1L',
      complainant: 'Citizen Grievance #89',
      issue: 'Quantity deficiency & No USP declaration',
      priority: 'High',
      status: 'under-review',
    },
    {
      id: 'INV-401',
      product: 'Deluxe Basmati Rice 5kg',
      complainant: 'Consumer Council Flag',
      issue: 'Dual price sticker on top of original MRP',
      priority: 'Urgent',
      status: 'under-review',
    },
    {
      id: 'INV-395',
      product: 'Artisanal Honey Jar 500g',
      complainant: 'Citizen Grievance #74',
      issue: 'Missing customer care address/phone',
      priority: 'Medium',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Assigned Investigations & Grievances
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Active enforcement matters assigned to your jurisdiction for inspection & notice issuance.
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Case ID</TableHead>
              <TableHead>Sampled Commodity</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Alleged Non-Compliance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyCases.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary-700">
                  {c.id}
                </TableCell>
                <TableCell className="font-semibold text-neutral-900">{c.product}</TableCell>
                <TableCell className="text-xs text-neutral-600">{c.complainant}</TableCell>
                <TableCell className="text-xs text-neutral-700">{c.issue}</TableCell>
                <TableCell>
                  <StatusBadge status={c.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="primary" size="sm" icon={CheckSquare}>
                    Issue Notice
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

export default OfficerInvestigationsPage;
