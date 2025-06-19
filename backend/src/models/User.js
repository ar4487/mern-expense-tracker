const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String
  },

  password: {
    type: String
    // Not required here because OAuth users may not have one initially
  },

  otp: {
    type: String
  },

  profilePic: {
    type: String,
    default: ''
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  },

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

  // ✅ New fields for OAuth support
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },

  oauthId: {
    type: String,
    default: null
  },

  hasPassword: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password if modified (native users only)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
