const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile,
  getAllUsers,
  updateUserRole,
  deleteUser
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

// Admin-only User Management
router.get("/users", verifyToken, adminMiddleware, getAllUsers);
router.put("/users/:id/role", verifyToken, adminMiddleware, updateUserRole);
router.delete("/users/:id", verifyToken, adminMiddleware, deleteUser);

module.exports = router;