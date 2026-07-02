const express = require("express");
const router = express.Router();
const {
  getRoomCategories,
  createRoomCategory,
  updateRoomCategory,
  deleteRoomCategory,
  reorderRoomCategories // <-- Import the new controller
} = require("../controllers/roomCategoryController");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getRoomCategories);
router.post("/", verifyToken, adminMiddleware, createRoomCategory);

// <-- Add this BEFORE the `/:id` route
router.put("/reorder", verifyToken, adminMiddleware, reorderRoomCategories); 

router.put("/:id", verifyToken, adminMiddleware, updateRoomCategory);
router.delete("/:id", verifyToken, adminMiddleware, deleteRoomCategory);

module.exports = router;