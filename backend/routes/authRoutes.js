const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  changePassword,
  deleteOwnAccount
} = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/register", register);

router.post("/login", login);

router.get(
  "/profile",
  verifyToken,
  getProfile
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

// Admin-only User Management
router.get("/users", verifyToken, adminMiddleware, getAllUsers);
router.put("/users/:id/role", verifyToken, adminMiddleware, updateUserRole);
router.delete("/users/:id", verifyToken, adminMiddleware, deleteUser);

module.exports = router;