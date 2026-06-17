const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/orderController");

// Public (Anyone/Guests can place orders)
router.post("/", createOrder);

// Admin Only (Only admin can manage, update status, list, or delete orders)
router.get("/", verifyToken, adminMiddleware, getOrders);
router.put("/:id", verifyToken, adminMiddleware, updateOrderStatus);
router.delete("/:id", verifyToken, adminMiddleware, deleteOrder);

module.exports = router;
