const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, select: false }, // ✅ select: false is good
  otp: { type: String },
  profileImage: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    default: null
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  oauthId: { type: String, default: null },
  hasPassword: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Fix: Also set `hasPassword = true` when password is set
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.hasPassword = true;
  next();
});

module.exports = mongoose.model('User', userSchema);
