import mongoose from 'mongoose';
import { applyJsonTransform } from '../../infra/schemaPlugin.js';

export const COMPLAINT_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
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
  status: {
    type: String,
    enum: [COMPLAINT_STATUS.DRAFT, COMPLAINT_STATUS.SUBMITTED],
    default: COMPLAINT_STATUS.SUBMITTED,
    index: true,
  },
});

complaintSchema.plugin(applyJsonTransform);

export const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
