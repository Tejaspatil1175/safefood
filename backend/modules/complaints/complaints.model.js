import mongoose from 'mongoose';
import { applyJsonTransform } from '../../infra/schemaPlugin.js';

export const COMPLAINT_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  IN_REVIEW: 'IN_REVIEW',
  VERIFIED: 'VERIFIED',
  VALID: 'VALID',
  ACTION_TAKEN: 'ACTION_TAKEN',
  REJECTED: 'REJECTED',
});

const violationSchema = new mongoose.Schema(
  {
    ruleId: { type: String, required: true },
    field: { type: String },
    message: { type: String, required: true },
    evidence: { type: mongoose.Schema.Types.Mixed, default: null },
    sourceRef: { type: String },
  },
  { _id: false },
);

const complaintSchema = new mongoose.Schema({
  scan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  district: {
    type: String,
    default: null,
    trim: true,
    index: true,
  },
  address: {
    type: String,
    default: '',
    trim: true,
  },
  submittedByRole: {
    type: String,
    enum: ['user', 'officer', 'admin', 'district_admin'],
    default: 'user',
    index: true,
  },
  violations: {
    type: [violationSchema],
    default: [],
  },
  evidenceFileIds: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  userNote: {
    type: String,
    default: '',
    trim: true,
  },
  officerNotes: {
    type: String,
    default: '',
    trim: true,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: Object.values(COMPLAINT_STATUS),
    default: COMPLAINT_STATUS.IN_REVIEW,
    index: true,
  },
});

complaintSchema.plugin(applyJsonTransform);

export const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
