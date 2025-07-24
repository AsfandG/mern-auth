import asyncHandler from "express-async-handler";
import User from "../../models/auth/user.model.js";

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404).json({ success: false, message: "User does not exist!" });
  }

  res
    .status(200)
    .json({ success: true, message: "user deleted successfully!" });
});
