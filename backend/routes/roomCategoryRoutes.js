const express = require("express");
const router = express.Router();
const {
  getRoomCategories,
  createRoomCategory,
  updateRoomCategory,
  deleteRoomCategory
} = require("../controllers/roomCategoryController");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getRoomCategories);
router.post("/", verifyToken, adminMiddleware, createRoomCategory);
router.put("/:id", verifyToken, adminMiddleware, updateRoomCategory);
router.delete("/:id", verifyToken, adminMiddleware, deleteRoomCategory);

module.exports = router;
