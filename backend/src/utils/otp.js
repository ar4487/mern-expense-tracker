const sendEmail = require('./email');

exports.sendOTP = async (email, otp) => {
  const subject = 'Your OTP Code';
  const message = `Your OTP code is: ${otp}`;
  await sendEmail(email, subject, message);
};
