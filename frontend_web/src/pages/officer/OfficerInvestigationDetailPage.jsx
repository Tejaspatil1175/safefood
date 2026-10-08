import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  User,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Play,
  Maximize2,
  Info,
  Check,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import complaintsService from '../../services/complaints';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ComplaintStatusBadge, ComplaintTimeline } from '../../components/complaints';
import { SkeletonCard } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const OfficerInvestigationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Investigation Form State
  const [notes, setNotes] = useState('');
  const [notesError, setNotesError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Decision Modal State: null | 'verified_genuine' | 'verified_not_genuine'
  const [decisionModal, setDecisionModal] = useState(null);

  // Evidence Image Zoom Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const fetchComplaintDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complaintsService.getComplaintById(id);
      if (!data) {
        setError('Complaint dossier not found.');
      } else {
        setComplaint(data);
        if (data.officerNotes) {
          setNotes(data.officerNotes);
        }
      }
    } catch (err) {
      console.error('Failed to load complaint', err);
      setError('Unable to retrieve complaint record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetail();
  }, [id]);

  // Action: Start Investigation
  const handleStartInvestigation = async () => {
    setSubmitting(true);
    try {
      const updated = await complaintsService.startInvestigation(id, {
        name: user?.name || 'Insp. Priya Verma',
      });
      setComplaint(updated);
      toast.success(
        'Field investigation initiated. You can now audit the commodity declarations.',
        'Investigation Started'
      );
    } catch (err) {
      toast.error(err.message || 'Failed to start investigation', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Decision Confirmation Modal with validation
  const handleOpenDecisionModal = (decision) => {
    if (!notes || !notes.trim()) {
      setNotesError('Please enter your inspection findings and notes before making a decision.');
      return;
    }
    setNotesError('');
    setDecisionModal(decision);
  };

  // Confirm and Submit Final Statutory Verification
  const handleConfirmDecision = async () => {
    if (!decisionModal) return;
    setSubmitting(true);
    try {
      const updated = await complaintsService.submitVerification(
        id,
        decisionModal,
        notes,
        { name: user?.name || 'Insp. Priya Verma' }
      );
      setComplaint(updated);
      const isGenuine = decisionModal === 'verified_genuine';
      toast.success(
        isGenuine
          ? 'Complaint verified as GENUINE statutory violation. Action notice registered.'
          : 'Complaint dismissed as NOT GENUINE. Product verified compliant.',
        'Decision Recorded'
      );
      setDecisionModal(null);
    } catch (err) {
      toast.error(err.message || 'Failed to submit verification', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="space-y-6">
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="p-8">
        <ErrorState
          title="Complaint Record Not Found"
          description={error || `No grievance dossier found with ID ${id}.`}
          onRetry={fetchComplaintDetail}
        />
        <div className="mt-4 text-center">
          <Link to="/app/officer/investigations">
            <Button variant="secondary" icon={ArrowLeft}>
              Back to Investigations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAssigned = complaint.status === 'assigned';
  const isInvestigating = complaint.status === 'under_investigation';
  const isResolved =
    complaint.status === 'verified_genuine' || complaint.status === 'verified_not_genuine';
  const isGenuine = complaint.status === 'verified_genuine';

  return (
    <div className="space-y-6">
      {/* ─── Back Link & Header ─── */}
      <div className="flex flex-col gap-3">
        <Link
          to="/app/officer/investigations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assigned Investigations</span>
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

          <div className="flex items-center gap-2">
            <Link to={`/app/officer/scan?product=${encodeURIComponent(complaint.productName)}`}>
              <Button variant="secondary" size="md" icon={ScanLine}>
                Scan Product Label
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 2-Column Main Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left / Main Column (2 spans) ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Complaint Dossier Information */}
          <Card className="shadow-card space-y-5">
            <CardHeader
              title="Grievance Details & Evidence"
              subtitle="Consumer reported non-compliance and photographic proof"
            />

            {/* Key Metas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-muted border border-border/80 text-xs">
              <div>
                <span className="text-neutral-400 font-medium block">Sampled Commodity:</span>
                <span className="text-neutral-900 font-bold text-sm block mt-0.5">
                  {complaint.productName}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Retail Store / Location:</span>
                <span className="text-neutral-800 font-semibold flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span>{complaint.storeOrLocation || 'Not specified'}</span>
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Complainant:</span>
                <span className="text-neutral-800 font-semibold flex items-center gap-1 mt-0.5">
                  <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span>{complaint.raisedBy?.name} ({complaint.raisedBy?.email})</span>
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Date Registered:</span>
                <span className="text-neutral-800 font-semibold flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* Description / Allegation */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Consumer Grievance Statement
              </h4>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed p-4 rounded-xl bg-surface border border-border">
                {complaint.description}
              </p>
            </div>

            {/* Evidence Image Preview (if present) */}
            {complaint.imageUrl && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Photographic Label Evidence
                  </h4>
                  <button
                    type="button"
                    onClick={() => setImageModalOpen(true)}
                    className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>View Fullscreen</span>
                  </button>
                </div>

                <div
                  onClick={() => setImageModalOpen(true)}
                  className="relative group rounded-xl overflow-hidden border border-border bg-neutral-900 cursor-pointer max-h-72 flex items-center justify-center"
                >
                  <img
                    src={complaint.imageUrl}
                    alt="Consumer label evidence"
                    className="w-full h-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-neutral-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-surface/90 text-neutral-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Click to enlarge</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Card 2: Investigation & Action Workflow */}
          <Card className="shadow-card space-y-5">
            <CardHeader
              title="Statutory Investigation Workspace"
              subtitle="Enforcement officer field audit, verification findings, and legal determination"
            />

            {/* ── State 1: Assigned (Waiting to Start) ── */}
            {isAssigned && (
              <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-xs">
                  <Play className="h-6 w-6 ml-0.5" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-sm font-bold text-blue-900">
                    Grievance Assigned for Investigation
                  </h3>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    This consumer complaint has been assigned to your jurisdiction. Initiate the field investigation to inspect the commodity, capture label scans, and record statutory findings.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  icon={Play}
                  loading={submitting}
                  onClick={handleStartInvestigation}
                  className="shadow-md"
                >
                  Start Investigation
                </Button>
              </div>
            )}

            {/* ── State 2: Under Investigation (Active) ── */}
            {isInvestigating && (
              <div className="space-y-5">
                {/* Active Notice Bar with Quick Scanner Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">
                        Active Field Investigation in Progress
                      </h4>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Perform on-site measurements and label verification per PCR 2011.
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/app/officer/scan?product=${encodeURIComponent(complaint.productName)}`}
                    className="shrink-0"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={ScanLine}
                      className="bg-white text-amber-900 hover:bg-amber-100 border-amber-300 font-semibold text-xs shadow-2xs"
                    >
                      Scan This Product's Label
                    </Button>
                  </Link>
                </div>

                {/* Officer Notes Textarea */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="officer-notes"
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
                  >
                    Officer Inspection Findings & Notes <span className="text-error-600">*</span>
                  </label>
                  <textarea
                    id="officer-notes"
                    rows={5}
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      if (notesError) setNotesError('');
                    }}
                    placeholder="Enter on-site verification details, e.g.: sampled batch numbers, measured tare/gross weights, font height in mm, presence of USP per 100ml, FSSAI verification, and dealer statements..."
                    className={`w-full p-3.5 text-xs sm:text-sm rounded-xl border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                      notesError
                        ? 'border-error-500 focus:ring-error-500/20'
                        : 'border-border focus:ring-primary-500/20 focus:border-primary-500'
                    }`}
                  />
                  {notesError && (
                    <p className="text-xs font-medium text-error-600 flex items-center gap-1 mt-1">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      <span>{notesError}</span>
                    </p>
                  )}
                  <span className="text-[11px] text-neutral-400 block text-right">
                    {notes.length} characters • Detailed findings required for statutory audit
                  </span>
                </div>

                {/* Decision Actions */}
                <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-end gap-3">
                  {/* Mark as Not Genuine Button (Red) */}
                  <Button
                    type="button"
                    variant="danger"
                    size="md"
                    icon={XCircle}
                    onClick={() => handleOpenDecisionModal('verified_not_genuine')}
                    className="bg-rose-600 hover:bg-rose-700 border-rose-700 text-white font-semibold shadow-xs"
                  >
                    Mark as Not Genuine
                  </Button>

                  {/* Verify as Genuine Button (Green) */}
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    icon={CheckCircle2}
                    onClick={() => handleOpenDecisionModal('verified_genuine')}
                    className="bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white font-semibold shadow-xs"
                  >
                    Verify as Genuine
                  </Button>
                </div>
              </div>
            )}

            {/* ── State 3: Resolved (Read-Only Outcome) ── */}
            {isResolved && (
              <div
                className={`p-5 rounded-2xl border ${
                  isGenuine
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-rose-50/70 border-rose-200'
                } space-y-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        isGenuine
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isGenuine ? (
                        <ShieldAlert className="h-6 w-6" />
                      ) : (
                        <ShieldCheck className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          isGenuine
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        {isGenuine
                          ? 'Statutory Violation Confirmed'
                          : 'Grievance Dismissed / Compliant'}
                      </span>
                      <h3
                        className={`text-base font-extrabold mt-1 ${
                          isGenuine ? 'text-emerald-950' : 'text-rose-950'
                        }`}
                      >
                        {isGenuine
                          ? 'Verified as Genuine Non-Compliance'
                          : 'Marked as Not Genuine'}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-neutral-500">
                    Resolved {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleDateString() : 'recently'}
                  </span>
                </div>

                {/* Formal Officer Finding */}
                <div className="p-4 rounded-xl bg-surface border border-border text-xs leading-relaxed space-y-1">
                  <span className="font-bold text-neutral-900 block">
                    Official Statutory Finding & Audit Record:
                  </span>
                  <p className="text-neutral-700 italic">
                    "{complaint.officerNotes || 'No additional notes provided.'}"
                  </p>
                </div>

                <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
                  <span>Audited by: <strong>{user?.name || 'Insp. Priya Verma'}</strong></span>
                  <span className="font-mono text-neutral-400">Decision Locked • Legal Dossier # {complaint.id}</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ─── Right Column / Sidebar (1 span) ─── */}
        <div className="space-y-6">
          {/* Card: Complaint Timeline */}
          <Card className="shadow-card">
            <CardHeader
              title="Investigation Timeline"
              subtitle="Chronological audit history and milestone tracking"
            />
            <div className="mt-4">
              <ComplaintTimeline timeline={complaint.timeline} />
            </div>
          </Card>

          {/* Card: Assigned Inspector Badge */}
          <Card className="shadow-card space-y-3">
            <CardHeader title="Enforcement Officer" subtitle="Assigned Investigating Inspector" />
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted border border-border">
              <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-sm shrink-0">
                PV
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-neutral-900 truncate">
                  {complaint.assignedOfficer?.name || 'Insp. Priya Verma'}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  State Legal Metrology Cell (Badge #LM-DEL-884)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Confirmation Modal: Genuine or Not Genuine Decision ─── */}
      <Modal
        isOpen={Boolean(decisionModal)}
        onClose={() => setDecisionModal(null)}
        title={
          decisionModal === 'verified_genuine'
            ? 'Confirm Verification as Genuine Complaint?'
            : 'Confirm Marking as Not Genuine?'
        }
        description="This action officially updates the statutory status and appends your audit findings to the legal timeline."
        size="md"
      >
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed ${
              decisionModal === 'verified_genuine'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <strong className="block font-bold mb-1">
              {decisionModal === 'verified_genuine'
                ? 'Statutory Violation Warning'
                : 'Case Dismissal Notice'}
            </strong>
            {decisionModal === 'verified_genuine'
              ? 'By verifying this grievance as genuine, you confirm that the packaged commodity fails statutory Legal Metrology rules (e.g., missing USP, weight deficit, font height). A formal Form-IV notice may be issued.'
              : 'By marking this grievance as not genuine, you confirm that the packaged commodity complies with Legal Metrology declarations, and this grievance will be closed.'}
          </div>

          <div className="p-3 rounded-lg bg-surface-muted border border-border text-xs">
            <span className="font-bold text-neutral-700 block mb-0.5">Your Recorded Finding:</span>
            <p className="text-neutral-800 line-clamp-3 italic">"{notes}"</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setDecisionModal(null)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={decisionModal === 'verified_genuine' ? 'primary' : 'danger'}
              size="md"
              loading={submitting}
              onClick={handleConfirmDecision}
              className={
                decisionModal === 'verified_genuine'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }
            >
              {decisionModal === 'verified_genuine'
                ? 'Confirm & Verify Genuine'
                : 'Confirm & Mark Not Genuine'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── Evidence Image Zoom Modal ─── */}
      <Modal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        title="Consumer Photographic Evidence"
        description={`Evidence image uploaded for Complaint ${complaint.id}`}
        size="lg"
      >
        <div className="flex items-center justify-center p-2 bg-neutral-950 rounded-xl overflow-hidden">
          <img
            src={complaint.imageUrl}
            alt="Enlarged label evidence"
            className="max-h-[70vh] w-auto object-contain rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default OfficerInvestigationDetailPage;
