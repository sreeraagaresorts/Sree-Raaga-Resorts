const express = require("express");

const router = express.Router();

const upload =
require("../middleware/upload");

const verifyToken =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} = require("../controllers/roomController");

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get("/", getRooms);

router.get("/:id", getRoom);

/*
|--------------------------------------------------------------------------
| Admin Only
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  verifyToken,
  adminMiddleware,
  upload.single("image"),
  createRoom
);

router.put(
  "/:id",
  verifyToken,
  adminMiddleware,
  upload.single("image"),
  updateRoom
);

router.delete(
  "/:id",
  verifyToken,
  adminMiddleware,
  deleteRoom
);

module.exports = router;