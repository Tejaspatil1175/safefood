import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Search,
  XCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  Package,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Maximize2,
} from 'lucide-react';
import complaintsService from '../../services/complaints';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ComplaintStatusBadge, ComplaintTimeline } from '../../components/complaints';
import { SkeletonCard } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';

export const UserComplaintDetailPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const fetchComplaint = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complaintsService.getComplaintById(id);
      if (!data) {
        setError('Complaint not found.');
      } else {
        // Strip out officer internal notes for citizen privacy/security
        const sanitizedTimeline = (data.timeline || []).map((t) => {
          if (t.status === 'verified_genuine') {
            return {
              ...t,
              note: 'Your grievance was verified as genuine by the Legal Metrology enforcement cell.',
            };
          }
          if (t.status === 'verified_not_genuine') {
            return {
              ...t,
              note: 'After physical inspection, this packaged commodity was verified to comply with Legal Metrology rules.',
            };
          }
          return t;
        });

        setComplaint({
          ...data,
          timeline: sanitizedTimeline,
        });
      }
    } catch (err) {
      console.error('Failed to load user complaint detail', err);
      setError('Unable to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <ErrorState
          title="Complaint Record Not Found"
          description={error || `No grievance record found with ID ${id}.`}
          onRetry={fetchComplaint}
        />
        <div className="mt-4 text-center">
          <Link to="/app/user/complaints">
            <Button variant="secondary" icon={ArrowLeft}>
              Back to My Complaints
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderStatusBanner = () => {
    switch (complaint.status) {
      case 'submitted':
        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-100 border border-neutral-300 flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Received, waiting for review
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                Your grievance has been safely logged in the Legal Metrology citizen queue. It will be assigned to a field enforcement officer shortly.
              </p>
            </div>
          </div>
        );

      case 'assigned':
      case 'under_investigation':
        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                An enforcement officer is looking into this
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                An authorized Legal Metrology inspector has been assigned and is verifying the packaged commodity at the specified retail location.
              </p>
            </div>
          </div>
        );

      case 'verified_genuine':
        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <span>Your complaint was verified as genuine</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full">
                  Action Taken
                </span>
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Physical inspection confirmed statutory violations under the Legal Metrology (Packaged Commodities) Rules 2011. Formal enforcement proceedings and notice have been initiated.
              </p>
            </div>
          </div>
        );

      case 'verified_not_genuine':
        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-100 border border-neutral-300 flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                After investigation, this complaint could not be verified
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                An inspector audited the packaging sample and verified that mandatory declarations (MRP, Quantity, Manufacturer information) satisfy statutory standards. Case is closed.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ─── Back Link & Title Header ─── */}
      <div className="space-y-2">
        <Link
          to="/app/user/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Complaints</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-bold text-primary-700 px-2.5 py-0.5 rounded-md bg-primary-50 border border-primary-200">
                {complaint.id}
              </span>
              <ComplaintStatusBadge status={complaint.status} size="md" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight mt-1.5">
              {complaint.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ─── Status Outcome Banner ─── */}
      {renderStatusBanner()}

      {/* ─── 2 Column Layout: Details & Timeline ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Complaint Details (2 spans) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-card space-y-4">
            <CardHeader
              title="Complaint Summary"
              subtitle="Product information and grievance statement"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface-muted border border-border text-xs">
              <div>
                <span className="text-neutral-400 font-medium block">Reported Product:</span>
                <span className="text-neutral-900 font-bold mt-0.5 block">
                  {complaint.productName}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Store / Location:</span>
                <span className="text-neutral-800 font-semibold mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span>{complaint.storeOrLocation}</span>
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Date Filed:</span>
                <span className="text-neutral-800 font-semibold mt-0.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
              {complaint.resolvedAt && (
                <div>
                  <span className="text-neutral-400 font-medium block">Resolution Date:</span>
                  <span className="text-neutral-800 font-semibold mt-0.5">
                    {new Date(complaint.resolvedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Your Grievance Statement
              </h4>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed p-4 rounded-xl bg-surface border border-border">
                {complaint.description}
              </p>
            </div>

            {/* Evidence Image Preview */}
            {complaint.imageUrl && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Uploaded Evidence Photo
                  </h4>
                  <button
                    type="button"
                    onClick={() => setImageModalOpen(true)}
                    className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>View Larger</span>
                  </button>
                </div>
                <div
                  onClick={() => setImageModalOpen(true)}
                  className="rounded-xl overflow-hidden border border-border bg-neutral-900 cursor-pointer max-h-60 flex items-center justify-center group"
                >
                  <img
                    src={complaint.imageUrl}
                    alt="Evidence"
                    className="w-full h-full object-cover max-h-60 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Timeline (1 span) */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader
              title="Progress Timeline"
              subtitle="Step-by-step verification milestones"
            />
            <div className="mt-4">
              <ComplaintTimeline timeline={complaint.timeline} />
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Evidence Zoom Modal ─── */}
      <Modal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        title="Evidence Photograph"
        description={`Photo attached for Complaint ${complaint.id}`}
        size="lg"
      >
        <div className="flex items-center justify-center p-2 bg-neutral-950 rounded-xl overflow-hidden">
          <img
            src={complaint.imageUrl}
            alt="Evidence zoomed"
            className="max-h-[70vh] w-auto object-contain rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserComplaintDetailPage;
