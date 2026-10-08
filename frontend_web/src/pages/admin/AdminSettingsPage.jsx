import React from 'react';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Sliders, ShieldCheck } from 'lucide-react';

export const AdminSettingsPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          System Rules & Configuration
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Tune Legal Metrology (Packaged Commodities) PCR 2011 rule parameters and OCR tolerance thresholds.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Mandatory Declarations Checklist (PCR Rule 6)"
          subtitle="Define mandatory packaging declaration rules enforced by the AI auditor"
        />

        <div className="space-y-3">
          {[
            'Name & Address of Manufacturer / Packer / Importer',
            'Generic or Common Name of Commodity',
            'Net Quantity in Standard Metric Units (g, kg, ml, l)',
            'Maximum Retail Price (MRP inclusive of all taxes)',
            'Month & Year of Manufacture / Packing / Import',
            'Unit Sale Price (USP) per g/ml/piece',
            'Country of Origin (for imported commodities)',
            'Consumer Care Cell Details (Name, Phone, Email)',
          ].map((rule, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface-subtle"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-success-600 shrink-0" />
                <span className="text-xs font-semibold text-neutral-800">{rule}</span>
              </div>
              <span className="text-[11px] font-bold uppercase text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                Mandatory
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex justify-end">
          <Button variant="primary" size="md">
            Save Rule Set
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
