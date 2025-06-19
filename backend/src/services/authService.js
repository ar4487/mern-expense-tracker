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
  // 👇 Update OTP for unverified user and resend
  existing.otp = otp;
  await existing.save();
  await sendOTP(email, otp);
  return { message: 'OTP re-sent to unverified email' };
}

// If new user
const hashedPassword = await bcrypt.hash(password, 10);
const user = await User.create({
  name,
  email,
  password: hashedPassword,
  otp,
  isVerified: false,
  role: 'user'
});

await sendOTP(email, otp);
return { message: 'Signup successful. OTP sent to email.' };

};

exports.verifyOTP = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  if (user.isVerified) throw new Error('Already verified');
  console.log('User OTP from DB:', user.otp);
console.log('OTP from request:', otp);
console.log('Type check:', typeof user.otp, typeof otp);
  if (user.otp !== otp) throw new Error('Invalid OTP');

  user.isVerified = true;
  user.otp = null;
  await user.save();

  return { message: 'Email verified successfully' };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !user.isVerified) throw new Error('Invalid credentials or account not verified');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Incorrect password');

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
