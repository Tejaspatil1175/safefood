import mongoose from 'mongoose';
import { applyJsonTransform } from '../../infra/schemaPlugin.js';

export const USER_ROLES = Object.freeze({
  SUPERADMIN: 'admin',
  DISTRICT_ADMIN: 'district_admin',
  OFFICER: 'officer',
  CITIZEN: 'user',
});

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  passwordHash: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CITIZEN,
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
  state: {
    type: String,
    default: 'Maharashtra',
    trim: true,
  },
  pincode: {
    type: String,
    default: '',
    trim: true,
  },
  phoneNumber: {
    type: String,
    default: '',
    trim: true,
  },
  badgeNumber: {
    type: String,
    default: null,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

userSchema.plugin(applyJsonTransform);

export const User = mongoose.model('User', userSchema);
export default User;
