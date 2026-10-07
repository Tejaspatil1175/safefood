import React from 'react';
import { Camera, UploadCloud, ShieldCheck, MapPin } from 'lucide-react';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

export const OfficerScanPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Field Enforcement Inspection Scan
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Capture on-site packaging photos with GPS geotagging for statutory evidence collection.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Inspection Metadata"
          subtitle="Record premises details before scanning"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Input
            label="Premises / Retail Outlet Name"
            placeholder="e.g. Metro Mart Supermarket #14"
            required
          />
          <Input
            label="Premises Location / City"
            placeholder="e.g. Sector 18, Central District"
            icon={MapPin}
            required
          />
          <Select
            label="Inspection Category"
            options={[
              { value: 'routine', label: 'Routine Market Surveillance' },
              { value: 'complaint', label: 'Citizen Complaint Follow-up' },
              { value: 'targeted', label: 'Targeted High-Risk Commodity' },
            ]}
          />
          <Input
            label="Seizure / Memo Ref (Optional)"
            placeholder="e.g. MEMO-2026-OCT-09"
          />
        </div>

        <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center bg-surface-subtle flex flex-col items-center justify-center">
          <div className="h-14 w-14 rounded-2xl bg-warning-50 text-warning-600 flex items-center justify-center mb-3">
            <Camera className="h-7 w-7" />
          </div>
          <h3 className="font-semibold text-neutral-900 text-sm">Capture High-Resolution Evidence</h3>
          <p className="text-xs text-neutral-500 mt-1 mb-5 max-w-md">
            Ensure batch code, date of packaging, and MRP font heights comply with PCR Rule 7 & Schedule II.
          </p>

          <div className="flex gap-3">
            <Button variant="primary" icon={Camera}>
              Open Field Camera
            </Button>
            <Button variant="secondary" icon={UploadCloud}>
              Upload File
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OfficerScanPage;
