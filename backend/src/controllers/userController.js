const userService = require('../services/userService');

exports.updatePassword = async (req, res) => {
  try {
    console.log('[updatePassword] req.user:', req.user);
    const result = await userService.updatePassword(req.user._id, req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[updatePassword] Error:', err.message);
    return res.status(400).json({ message: err.message });
  }
};
