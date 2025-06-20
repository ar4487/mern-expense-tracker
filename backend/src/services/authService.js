const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendOTP } = require('../utils/otp');
const { createAccessToken, createRefreshToken } = require('../utils/jwt');

exports.signup = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });

  if (existing && existing.isVerified) {
    throw new Error('Email already registered and verified');
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  if (existing && !existing.isVerified) {
    existing.otp = otp;
    await existing.save();
    await sendOTP(existing.email, existing.otp);
    return { message: 'OTP re-sent to unverified email' };
  }

  // ✅ Create new user using .save() to trigger pre-save hook
  const user = new User({
    name,
    email,
    password,
    otp,
    isVerified: false,
    role: 'user'
  });

  await user.save(); // ✅ password hashed + hasPassword set
  await sendOTP(user.email, user.otp);

  return { message: 'Signup successful. OTP sent to email.' };
};

exports.verifyOTP = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  if (user.isVerified) throw new Error('Already verified');
  if (user.otp !== otp) throw new Error('Invalid OTP');

  user.isVerified = true;
  user.otp = null;
  await user.save();

  return { message: 'Email verified successfully' };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new Error("User not found");
  if (!user.isVerified) throw new Error("Email not verified");
  if (!user.hasPassword) throw new Error("Please set a password first");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Incorrect password");

  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken
  };
};
