import React from 'react';
import Card from '../../components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { UserX, Shield } from 'lucide-react';

export const AdminUsersPage = () => {
  const dummyUsers = [
    { id: 'USR-101', name: 'Ramesh Sharma', email: 'user@test.com', role: 'Consumer', joined: 'Jan 15, 2026', scans: 12, status: 'active' },
    { id: 'USR-102', name: 'Ananya Gupta', email: 'ananya@example.com', role: 'Consumer', joined: 'Feb 02, 2026', scans: 28, status: 'active' },
    { id: 'USR-103', name: 'Vikram Singh', email: 'vikram.s@sample.com', role: 'Consumer', joined: 'Mar 10, 2026', scans: 5, status: 'active' },
    { id: 'USR-104', name: 'Sunita Rao', email: 'sunita.rao@mail.com', role: 'Consumer', joined: 'Apr 22, 2026', scans: 41, status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Directory of all registered consumers and platform accounts.
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>User ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Scans Performed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary-700">
                  {u.id}
                </TableCell>
                <TableCell className="font-semibold text-neutral-900">{u.name}</TableCell>
                <TableCell className="text-xs text-neutral-600">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="primary" size="sm">
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-neutral-500">{u.joined}</TableCell>
                <TableCell className="font-semibold text-neutral-800">{u.scans}</TableCell>
                <TableCell>
                  <StatusBadge status={u.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-error-600">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border">
          <Pagination currentPage={1} totalPages={10} totalItems={48} itemsPerPage={5} />
        </div>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
