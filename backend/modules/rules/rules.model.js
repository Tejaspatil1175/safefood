import mongoose from 'mongoose';
import { applyJsonTransform } from '../../infra/schemaPlugin.js';

const heightBandMongooseSchema = new mongoose.Schema(
  {
    minQuantity: { type: Number, required: true },
    maxQuantity: { type: Number, default: null },
    unit: { type: String, required: true },
    minHeightMm: { type: Number, required: true },
    sourceRef: { type: String, required: true },
  },
  { _id: false },
);

const singleRuleMongooseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    field: { type: String, required: true },
    type: { type: String, required: true, enum: ['presence', 'format', 'min_height'] },
    mandatory: { type: Boolean, default: true },
    sourceRef: { type: String, required: true },
    message: { type: String, required: true },
    keywords: [{ type: String }],
    pattern: { type: String },
    allowedUnits: [{ type: String }],
    heightBands: [heightBandMongooseSchema],
  },
  { _id: false },
);

const ruleSetSchema = new mongoose.Schema({
  version: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  source: { type: String, required: true },
  effectiveFrom: { type: String },
  isActive: { type: Boolean, default: true, index: true },
  rules: [singleRuleMongooseSchema],
});

ruleSetSchema.plugin(applyJsonTransform);

export const RuleSet = mongoose.model('RuleSet', ruleSetSchema);
export default RuleSet;
