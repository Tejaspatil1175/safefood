import React from 'react';
import { UploadCloud, Camera, Sparkles } from 'lucide-react';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';

export const UserScanPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Scan Product Label
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Upload front or back packaging photos to trigger OCR and automated compliance validation.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Upload Label Images"
          subtitle="Supports JPG, PNG, WEBP up to 10MB"
        />

        <div className="border-2 border-dashed border-primary-300/70 bg-primary-50/20 hover:bg-primary-50/40 rounded-2xl p-12 text-center transition-colors flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">
            Drag and drop label photo here
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1 mb-6">
            Ensure MRP, Net Weight, Manufacturing Date, and Importer/Manufacturer details are clearly legible.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="primary" icon={UploadCloud}>
              Browse Image
            </Button>
            <Button variant="secondary" icon={Camera}>
              Take Photo
            </Button>
          </div>
        </div>
      </Card>

      <div className="p-4 rounded-xl bg-surface-muted border border-border flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-600 space-y-1">
          <p className="font-semibold text-neutral-900">Automated Legal Metrology Checks:</p>
          <p>• Mandatory 8 statutory declarations verification</p>
          <p>• Unit Sale Price (USP) calculation & validity</p>
          <p>• Expiry date & batch coding detection</p>
        </div>
      </div>
    </div>
  );
};

export default UserScanPage;
