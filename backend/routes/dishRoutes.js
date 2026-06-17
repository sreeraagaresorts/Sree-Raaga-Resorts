const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish
} = require("../controllers/dishController");

// Public
router.get("/", getDishes);
router.get("/:id", getDish);

// Admin Only
router.post("/", verifyToken, adminMiddleware, upload.single("image"), createDish);
router.put("/:id", verifyToken, adminMiddleware, upload.single("image"), updateDish);
router.delete("/:id", verifyToken, adminMiddleware, deleteDish);

module.exports = router;
