const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getCategories,
  createCategory,
  deleteCategory
} = require("../controllers/categoryController");

// Public endpoint to get all categories
router.get("/", getCategories);

// Admin endpoints to add and delete categories
router.post("/", verifyToken, adminMiddleware, createCategory);
router.delete("/:name", verifyToken, adminMiddleware, deleteCategory);

module.exports = router;
