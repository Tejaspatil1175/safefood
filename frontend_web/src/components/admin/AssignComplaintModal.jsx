import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';
import adminService from '../../services/admin';
import complaintsService from '../../services/complaints';
import { useToast } from '../common/Toast';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const AssignComplaintModal = ({
  isOpen,
  onClose,
  complaint,
  onAssigned,
}) => {
  const toast = useToast();

  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedOfficerId('');
      setInstructions('');
      setError('');
      return;
    }

    const loadOfficers = async () => {
      setLoading(true);
      try {
        const list = await adminService.getOfficersWithWorkload();
        setOfficers(list || []);
        if (complaint?.assignedOfficer?.id) {
          setSelectedOfficerId(complaint.assignedOfficer.id);
        } else if (list && list.length > 0) {
          setSelectedOfficerId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load officers list', err);
      } finally {
        setLoading(false);
      }
    };

    loadOfficers();
  }, [isOpen, complaint]);

  if (!isOpen || !complaint) return null;

  const filteredOfficers = officers.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmAssign = async () => {
    if (!selectedOfficerId) {
      setError('Please select an enforcement officer.');
      return;
    }

    const targetOfficer = officers.find((o) => o.id === selectedOfficerId);
    if (!targetOfficer) return;

    setSubmitting(true);
    setError('');
    try {
      await complaintsService.assignComplaint(
        complaint.id,
        { id: targetOfficer.id, name: targetOfficer.name },
        instructions,
        'System Administrator'
      );

      toast.success(
        `Complaint #${complaint.id} assigned to ${targetOfficer.name}.`,
        'Officer Assigned'
      );

      if (onAssigned) {
        onAssigned();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const isReassign = Boolean(complaint.assignedOfficer);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isReassign ? 'Reassign Enforcement Officer' : 'Assign Officer to Complaint'}
      description={`Assign statutory case #${complaint.id} to an authorized field inspector.`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Complaint Summary Box */}
        <div className="p-3.5 rounded-xl bg-surface-muted border border-border text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-primary-700">{complaint.id}</span>
            <span className="text-neutral-500 font-medium">Product: {complaint.productName}</span>
          </div>
          <h4 className="font-bold text-neutral-900 line-clamp-1">{complaint.title}</h4>
          <p className="text-neutral-500 text-[11px] truncate">
            Location: {complaint.storeOrLocation}
          </p>
        </div>

        {/* Officer Search Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Select Enforcement Officer
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by officer name, jurisdiction, badge..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Officers List Radio Selection */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-8 text-center text-xs text-neutral-400">Loading officers...</div>
          ) : filteredOfficers.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">No officers found.</div>
          ) : (
            filteredOfficers.map((officer) => {
              const isSelected = selectedOfficerId === officer.id;
              const activeCases = officer.activeWorkload ?? 0;

              return (
                <label
                  key={officer.id}
                  onClick={() => setSelectedOfficerId(officer.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/50 shadow-xs ring-1 ring-primary-500'
                      : 'border-border bg-surface hover:bg-surface-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="officerSelection"
                      checked={isSelected}
                      onChange={() => setSelectedOfficerId(officer.id)}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4 border-border"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900">
                          {officer.name}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-semibold">
                          {officer.badgeNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {officer.jurisdiction}
                      </p>
                    </div>
                  </div>

                  {/* Workload Badge */}
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        activeCases > 3
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Briefcase className="h-3 w-3" />
                      <span>{activeCases} Active Cases</span>
                    </span>
                  </div>
                </label>
              );
            })
          )}
        </div>

        {/* Optional Instructions Note */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Instructions / Priority Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g., Prioritize physical tare weight verification or check batch coding..."
            className="w-full p-2.5 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {error && (
          <p className="text-xs text-error-600 font-medium flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{error}</span>
          </p>
        )}

        {/* Modal Actions */}
        <div className="pt-2 border-t border-border flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={submitting}
            onClick={handleConfirmAssign}
            className="font-bold shadow-md"
          >
            {isReassign ? 'Confirm Reassignment' : 'Assign Officer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignComplaintModal;
