const express = require("express");

const router = express.Router();

const verifyToken =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const {
  sendMessage,
  getAllMessages,
  deleteMessage,
  markMessageAsRead
} = require("../controllers/contactController");

/*
|--------------------------------------------------------------------------
| Public Route
|--------------------------------------------------------------------------
*/

router.post("/", sendMessage);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  verifyToken,
  adminMiddleware,
  getAllMessages
);

router.put(
  "/:id/read",
  verifyToken,
  adminMiddleware,
  markMessageAsRead
);

router.delete(
  "/:id",
  verifyToken,
  adminMiddleware,
  deleteMessage
);

module.exports = router;