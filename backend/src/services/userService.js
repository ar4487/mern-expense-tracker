const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.updatePassword = async (userId, { currentPassword, newPassword }) => {
  console.log(`[updatePassword] Called by: ${userId}`);

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (user.authProvider === 'google' && !user.hasPassword) {
    console.log('[OAuth] First time setting password');
    user.password = await bcrypt.hash(newPassword, 10);
    user.hasPassword = true;
    await user.save();
    return { message: 'Password set for OAuth user' };
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('Incorrect current password');

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: 'Password updated successfully' };
};
