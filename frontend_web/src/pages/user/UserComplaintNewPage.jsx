import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  MapPin,
  Tag,
  Package,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import complaintsService from '../../services/complaints';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const UserComplaintNewPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();

  const prefilledProduct = searchParams.get('product') || '';
  const prefilledScanId = searchParams.get('scanId') || '';

  const [formData, setFormData] = useState({
    title: prefilledProduct ? `Missing Declarations on ${prefilledProduct}` : '',
    productName: prefilledProduct,
    storeOrLocation: '',
    description: '',
    scanId: prefilledScanId,
  });

  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (evidencePreview && evidencePreview.startsWith('blob:')) {
        URL.revokeObjectURL(evidencePreview);
      }
    };
  }, [evidencePreview]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Please upload a JPG or PNG image.' }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'File size must not exceed 10 MB.' }));
      return;
    }

    setEvidenceFile(file);
    const objUrl = URL.createObjectURL(file);
    setEvidencePreview(objUrl);
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const handleRemoveImage = () => {
    if (evidencePreview && evidencePreview.startsWith('blob:')) {
      URL.revokeObjectURL(evidencePreview);
    }
    setEvidenceFile(null);
    setEvidencePreview('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim() || formData.title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters.';
    }
    if (!formData.productName.trim()) {
      errs.productName = 'Product name is required.';
    }
    if (!formData.storeOrLocation.trim()) {
      errs.storeOrLocation = 'Store or purchase location is required.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      errs.description = 'Please describe the issue in detail (at least 20 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Use uploaded image preview or realistic placeholder evidence
      const imageUrl =
        evidencePreview ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';

      const newComplaint = await complaintsService.createComplaint(
        {
          ...formData,
          imageUrl,
        },
        user || { id: 'usr-101', name: 'Citizen User', email: 'user@test.com' }
      );

      toast.success(
        `Complaint #${newComplaint.id} registered successfully. An officer will review it shortly.`,
        'Complaint Submitted'
      );

      navigate(`/app/user/complaints/${newComplaint.id}`);
    } catch (err) {
      console.error('Failed to submit complaint', err);
      toast.error(err.message || 'Failed to submit complaint. Please try again.', 'Submission Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ─── Back Link & Header ─── */}
      <div className="space-y-2">
        <Link
          to="/app/user/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Complaints</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Raise a Legal Metrology Complaint
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Report deceptive packaging, missing Unit Sale Price (USP), dual MRP stickers, weight deficiencies, or unlisted manufacturer details.
        </p>
      </div>

      {/* ─── Form Card ─── */}
      <Card className="shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Complaint Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Complaint Subject / Title <span className="text-error-600">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., No Unit Sale Price on Cooking Oil Pouch"
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-error-500 focus:ring-error-500/20'
                  : 'border-border focus:ring-primary-500/20 focus:border-primary-500'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-error-600 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Grid: Product Name & Store Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Product / Brand Name <span className="text-error-600">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="e.g., Sunrise Sunflower Cooking Oil 1L"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.productName
                    ? 'border-error-500 focus:ring-error-500/20'
                    : 'border-border focus:ring-primary-500/20 focus:border-primary-500'
                }`}
              />
              {errors.productName && (
                <p className="text-xs text-error-600 mt-1 font-medium">{errors.productName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Store / Retail Location <span className="text-error-600">*</span>
              </label>
              <input
                type="text"
                value={formData.storeOrLocation}
                onChange={(e) => handleInputChange('storeOrLocation', e.target.value)}
                placeholder="e.g., Metro Mart #14, Sector 18, Noida"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.storeOrLocation
                    ? 'border-error-500 focus:ring-error-500/20'
                    : 'border-border focus:ring-primary-500/20 focus:border-primary-500'
                }`}
              />
              {errors.storeOrLocation && (
                <p className="text-xs text-error-600 mt-1 font-medium">{errors.storeOrLocation}</p>
              )}
            </div>
          </div>

          {/* Optional Linked Scan ID */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Linked AI Scan Reference (Optional)
            </label>
            <input
              type="text"
              value={formData.scanId}
              onChange={(e) => handleInputChange('scanId', e.target.value)}
              placeholder="e.g., SCN-2026-904"
              className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Detailed Description of Violation <span className="text-error-600">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what you observed: was there a double price sticker? Did the package weigh less than declared? Was the consumer care number missing? (Minimum 20 characters)"
              className={`w-full p-3.5 text-xs sm:text-sm rounded-xl border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.description
                  ? 'border-error-500 focus:ring-error-500/20'
                  : 'border-border focus:ring-primary-500/20 focus:border-primary-500'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-error-600 mt-1 font-medium">{errors.description}</p>
            )}
            <span className="text-[11px] text-neutral-400 block text-right mt-1">
              {formData.description.length}/20 characters minimum
            </span>
          </div>

          {/* Photographic Evidence Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Attach Photographic Evidence (Optional)
            </label>

            {evidencePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border bg-surface p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={evidencePreview}
                    alt="Evidence preview"
                    className="h-16 w-16 object-cover rounded-lg border border-border"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block truncate max-w-xs">
                      {evidenceFile?.name || 'Evidence photo attached'}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {evidenceFile ? `${(evidenceFile.size / 1024 / 1024).toFixed(2)} MB` : 'Attached'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-neutral-400 hover:text-error-600 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary-400 hover:bg-surface-subtle transition-colors">
                <UploadCloud className="h-8 w-8 text-neutral-400 mb-1" />
                <span className="text-xs font-bold text-neutral-800">
                  Click to upload packaging photo or receipt
                </span>
                <span className="text-[11px] text-neutral-400 mt-0.5">
                  JPG, JPEG, or PNG up to 10 MB
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            {errors.image && (
              <p className="text-xs text-error-600 mt-1 font-medium">{errors.image}</p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <Link to="/app/user/complaints">
              <Button type="button" variant="secondary" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
              className="font-bold shadow-md"
            >
              Submit Complaint
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserComplaintNewPage;
