import React from 'react';
import { Package, Factory, Scale, Tag, Calendar, MapPin, PhoneCall, ShieldCheck } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';

/**
 * ProductInfoCard component displaying extracted Legal Metrology fields
 */
export const ProductInfoCard = ({ info = {} }) => {
  return (
    <Card className="p-6">
      <CardHeader
        title="Extracted Declaration Metadata"
        subtitle="Mandatory packaged commodity parameters extracted via OCR"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Product / Commodity Name
            </span>
            <p className="text-sm font-bold text-neutral-900 mt-0.5 break-words">
              {info.productName || '—'}
            </p>
          </div>
        </div>

        {/* Manufacturer */}
        <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Factory className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Manufacturer / Packer / Importer
            </span>
            <p className="text-xs font-semibold text-neutral-800 mt-0.5 break-words">
              {info.manufacturer || '—'}
            </p>
          </div>
        </div>

        {/* Net Quantity */}
        <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Scale className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Net Quantity Declaration
            </span>
            <p className="text-sm font-bold text-neutral-900 mt-0.5">
              {info.netQuantity || '—'}
            </p>
          </div>
        </div>

        {/* MRP & Unit Sale Price */}
        <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Tag className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Maximum Retail Price (MRP) & USP
            </span>
            <p className="text-sm font-bold text-neutral-900 mt-0.5">
              {info.mrp || '—'}
            </p>
            {info.unitSalePrice && (
              <p className="text-xs text-primary-700 font-semibold mt-0.5">
                Unit Sale Price: {info.unitSalePrice}
              </p>
            )}
          </div>
        </div>

        {/* Dates & Origin */}
        <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Manufacturing & Expiry Dates
            </span>
            <p className="text-xs font-semibold text-neutral-800 mt-0.5">
              Mfg: {info.manufactureDate || '—'} {info.expiryDate ? `• Exp: ${info.expiryDate}` : ''}
            </p>
            {info.countryOfOrigin && (
              <p className="text-xs text-neutral-500 mt-0.5">
                Country of Origin: <strong className="text-neutral-700">{info.countryOfOrigin}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Consumer Care & Regulatory */}
        <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Consumer Care & FSSAI License
            </span>
            <p className="text-xs font-semibold text-neutral-800 mt-0.5 break-words">
              {info.consumerCare || '—'}
            </p>
            {info.fssaiLicNo && (
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                FSSAI Lic: {info.fssaiLicNo}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductInfoCard;
