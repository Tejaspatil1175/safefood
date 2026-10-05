import mongoose from 'mongoose';
import { applyJsonTransform } from '../../infra/schemaPlugin.js';
import { COMPLIANCE_STATUS } from '../compliance/compliance.types.js';

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  barcode: {
    type: String,
    default: null,
    trim: true,
    index: true,
  },
  ruleSetVersion: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    enum: [COMPLIANCE_STATUS.PASS, COMPLIANCE_STATUS.FAIL, COMPLIANCE_STATUS.UNCERTAIN],
    required: true,
    index: true,
  },
  report: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  fields: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  qualityIssues: {
    type: [String],
    default: [],
  },
  product: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

scanSchema.plugin(applyJsonTransform);

export const Scan = mongoose.model('Scan', scanSchema);
export default Scan;
