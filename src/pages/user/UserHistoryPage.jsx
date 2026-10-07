import React from 'react';
import Card, { CardHeader } from '../../components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { Eye, Download } from 'lucide-react';

export const UserHistoryPage = () => {
  const dummyHistory = [
    { id: 'SCN-1049', product: 'Organic Almond Milk 1L', brand: 'NutriPure Foods', score: '100%', date: 'Oct 07, 2026', status: 'compliant' },
    { id: 'SCN-1048', product: 'Imported Belgian Cocoa 250g', brand: 'ChocoArtisan Ltd', score: '62%', date: 'Oct 06, 2026', status: 'warning' },
    { id: 'SCN-1047', product: 'Premium Mustard Oil 500ml', brand: 'Kisan Naturals', score: '37%', date: 'Oct 04, 2026', status: 'non-compliant' },
    { id: 'SCN-1046', product: 'Wheat Flour / Atta 5kg', brand: 'FarmGold Agro', score: '100%', date: 'Sep 29, 2026', status: 'compliant' },
    { id: 'SCN-1045', product: 'Instant Coffee Granules 100g', brand: 'BeanRoast India', score: '87%', date: 'Sep 24, 2026', status: 'compliant' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            My Scan History
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review past product label audits and download Legal Metrology compliance reports.
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Scan ID</TableHead>
              <TableHead>Product / Commodity</TableHead>
              <TableHead>Brand / Manufacturer</TableHead>
              <TableHead>PCR Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Compliance Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyHistory.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono font-medium text-primary-700 text-xs">
                  {row.id}
                </TableCell>
                <TableCell className="font-semibold text-neutral-900">
                  {row.product}
                </TableCell>
                <TableCell>{row.brand}</TableCell>
                <TableCell>
                  <span className="font-semibold text-neutral-800">{row.score}</span>
                </TableCell>
                <TableCell className="text-xs text-neutral-500">{row.date}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="ghost" size="sm" icon={Eye}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm" icon={Download} aria-label="Download report" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border">
          <Pagination currentPage={1} totalPages={3} totalItems={15} itemsPerPage={5} />
        </div>
      </Card>
    </div>
  );
};

export default UserHistoryPage;
