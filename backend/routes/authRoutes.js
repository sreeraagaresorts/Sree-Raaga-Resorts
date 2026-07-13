const express = require("express");

const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  changePassword,
  deleteOwnAccount,
  getAuditLogs,
  getWishlist,
  toggleWishlist,
  forgotPasswordSendOtp,
  forgotPasswordVerifyAndReset
} = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/register", register);

router.post("/login", login);
router.post("/logout", verifyToken, logout);

router.post("/forgot-password/send-otp", forgotPasswordSendOtp);
router.post("/forgot-password/reset", forgotPasswordVerifyAndReset);

router.get(
  "/profile",
  verifyToken,
  getProfile
);

router.put(
  "/profile",
  verifyToken,
  updateProfile
);

router.put(
  "/change-password",
  verifyToken,
  changePassword
);

router.delete(
  "/delete-account",
  verifyToken,
  deleteOwnAccount
);

router.get("/wishlist", verifyToken, getWishlist);
router.post("/wishlist/toggle", verifyToken, toggleWishlist);

// Admin-only User Management
router.get("/users", verifyToken, adminMiddleware, getAllUsers);
router.get("/users/history", verifyToken, adminMiddleware, getAuditLogs);
router.put("/users/:id/role", verifyToken, adminMiddleware, updateUserRole);
router.delete("/users/:id", verifyToken, adminMiddleware, deleteUser);

module.exports = router;