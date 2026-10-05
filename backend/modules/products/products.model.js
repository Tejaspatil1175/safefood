import mongoose from 'mongoose';
import { applyJsonTransform } from '../../infra/schemaPlugin.js';

const productSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  variant: { type: String },
  netQuantity: {
    value: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  frontPanelMm: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  manufacturer: {
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  fssaiNo: { type: String },
  sourceNote: { type: String, required: true },
  verifiedAt: { type: Date, default: Date.now },
});

productSchema.plugin(applyJsonTransform);

export const Product = mongoose.model('Product', productSchema);
export default Product;
