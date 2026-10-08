import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Maximize2,
  UserPlus,
} from 'lucide-react';
import complaintsService from '../../services/complaints';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ComplaintStatusBadge, ComplaintTimeline } from '../../components/complaints';
import { OfficerVerificationIndicator, AssignComplaintModal } from '../../components/admin';
import { SkeletonCard } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';

export const AdminComplaintDetailPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Evidence Zoom Modal & Assign Modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const fetchComplaint = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complaintsService.getComplaintById(id);
      if (!data) {
        setError('Complaint record not found.');
      } else {
        setComplaint(data);
      }
    } catch (err) {
      console.error('Failed to load complaint', err);
      setError('Unable to fetch complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
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
          description={error || `No complaint record found with ID ${id}.`}
          onRetry={fetchComplaint}
        />
        <div className="mt-4 text-center">
          <Link to="/app/admin/complaints">
            <Button variant="secondary" icon={ArrowLeft}>
              Back to Grievance Queue
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isResolved =
    complaint.status === 'verified_genuine' || complaint.status === 'verified_not_genuine';
  const isGenuine = complaint.status === 'verified_genuine';
  const canAssignOrReassign =
    complaint.status === 'submitted' || complaint.status === 'assigned';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ─── Back Link & Title Header ─── */}
      <div className="space-y-2">
        <Link
          to="/app/admin/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Complaints Queue</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          {canAssignOrReassign && (
            <Button
              variant="primary"
              size="md"
              icon={UserPlus}
              onClick={() => setAssignModalOpen(true)}
              className="font-bold shadow-md"
            >
              {complaint.assignedOfficer ? 'Reassign Inspector' : 'Assign Inspector'}
            </Button>
          )}
        </div>
      </div>

      {/* ─── Main 2 Column Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Investigation Outcome & Officer Audit */}
          <Card className="shadow-card space-y-4">
            <CardHeader
              title="Enforcement & Investigation Status"
              subtitle="Assigned inspector audit findings and statutory resolution"
            />

            {/* Resolved Big Banner */}
            {isResolved && (
              <div
                className={`p-5 rounded-2xl border ${
                  isGenuine
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-rose-50 border-rose-300'
                } space-y-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {isGenuine ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                    ) : (
                      <XCircle className="h-6 w-6 text-rose-700" />
                    )}
                    <h3
                      className={`text-base font-extrabold ${
                        isGenuine ? 'text-emerald-950' : 'text-rose-950'
                      }`}
                    >
                      {isGenuine
                        ? '✓ Complaint verified - the complaint is genuine'
                        : '✕ Investigated - not genuine'}
                    </h3>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isGenuine
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    {isGenuine ? 'Notice Issued' : 'Case Closed'}
                  </span>
                </div>

                {/* Officer Formal Notes */}
                <div className="p-3.5 rounded-xl bg-surface border border-border text-xs space-y-1">
                  <span className="font-bold text-neutral-900 block">
                    Official Inspection Finding & Notes:
                  </span>
                  <p className="text-neutral-800 leading-relaxed italic">
                    "{complaint.officerNotes || 'No notes provided.'}"
                  </p>
                </div>

                <div className="text-[11px] text-neutral-600 flex items-center justify-between">
                  <span>
                    Investigated by: <strong>{complaint.assignedOfficer?.name || 'Authorized Inspector'}</strong>
                  </span>
                  <span>
                    Decision date: {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : 'Recent'}
                  </span>
                </div>
              </div>
            )}

            {/* Investigation Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface-muted border border-border text-xs">
              <div>
                <span className="text-neutral-400 font-medium block">Assigned Officer:</span>
                <div className="mt-1">
                  <OfficerVerificationIndicator
                    officer={complaint.assignedOfficer}
                    status={complaint.status}
                    onAssign={() => setAssignModalOpen(true)}
                  />
                </div>
              </div>

              <div>
                <span className="text-neutral-400 font-medium block">Assignment Timestamp:</span>
                <span className="font-semibold text-neutral-800 mt-0.5 block">
                  {complaint.assignedAt ? new Date(complaint.assignedAt).toLocaleString() : 'Pending Assignment'}
                </span>
              </div>
            </div>
          </Card>

          {/* Card 2: Consumer Grievance Details & Proof */}
          <Card className="shadow-card space-y-4">
            <CardHeader
              title="Citizen Grievance Dossier"
              subtitle="Reported consumer evidence, commodity, and store details"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface-muted border border-border text-xs">
              <div>
                <span className="text-neutral-400 font-medium block">Product Name:</span>
                <span className="font-bold text-neutral-900 mt-0.5 block">
                  {complaint.productName}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Purchase Location:</span>
                <span className="font-semibold text-neutral-800 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span>{complaint.storeOrLocation}</span>
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Consumer Name:</span>
                <span className="font-semibold text-neutral-800 mt-0.5 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span>{complaint.raisedBy?.name}</span>
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Consumer Email:</span>
                <span className="font-semibold text-neutral-800 mt-0.5">
                  {complaint.raisedBy?.email}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Grievance Description
              </h4>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed p-4 rounded-xl bg-surface border border-border">
                {complaint.description}
              </p>
            </div>

            {/* Evidence Photo Preview */}
            {complaint.imageUrl && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Consumer Photographic Evidence
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
                  className="rounded-xl overflow-hidden border border-border bg-neutral-900 cursor-pointer max-h-64 flex items-center justify-center group"
                >
                  <img
                    src={complaint.imageUrl}
                    alt="Evidence"
                    className="w-full h-full object-cover max-h-64 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right / Sidebar Column (1 span) */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader
              title="Audit Timeline"
              subtitle="Full chronological status history"
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
        title="Consumer Photographic Evidence"
        description={`Evidence image uploaded for Case #${complaint.id}`}
        size="lg"
      >
        <div className="flex items-center justify-center p-2 bg-neutral-950 rounded-xl overflow-hidden">
          <img
            src={complaint.imageUrl}
            alt="Evidence full"
            className="max-h-[70vh] w-auto object-contain rounded-lg"
          />
        </div>
      </Modal>

      {/* ─── Reassign Modal ─── */}
      <AssignComplaintModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        complaint={complaint}
        onAssigned={fetchComplaint}
      />
    </div>
  );
};

export default AdminComplaintDetailPage;
