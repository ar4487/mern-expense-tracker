const bcrypt = require('bcrypt');
const User = require('../models/User');

const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new Error('User not found');

  if (user.authProvider === 'google' && !user.hasPassword) {
    user.password = newPassword; // ✅ Plain - will be hashed by pre-save
    user.hasPassword = true;
    await user.save();
    return { message: 'Password set for OAuth user' };
  }

  if (!currentPassword) throw new Error('Current password is required');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('Incorrect current password');

  user.password = newPassword; // ✅ Plain
  await user.save();

  return { message: 'Password updated successfully' };
};

module.exports = { updatePassword };
