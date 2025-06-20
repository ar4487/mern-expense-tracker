const userService = require('../services/userService');


const updatePassword = async (req, res) => {
  try {
   // console.log('[updatePassword] req.user:', req.user);
    // console.log("[updatePassword] Body:", { currentPassword, newPassword });
    const result = await userService.updatePassword(req.user._id, req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[updatePassword] Error:', err.message);
    return res.status(400).json({ message: err.message });
  }
};
const updateProfileImage= async(req,res)=>{
try {
  const user=req.user;
  if(!req.file) return res.status(400).json({message:"No File Uploaded"})
    user.profileImage =`/uploads/${req.file.filename}`
  await user.save()
  res.status(200).json({message:'Image uploaded',imageUrl:user.profileImage})
} catch (error) {
  console.error("Image uploaded error",error)
  res.status(500).json({message:"Internal server error"})
}
}
module.exports = { updateProfileImage,updatePassword};