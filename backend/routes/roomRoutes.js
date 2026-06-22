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
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "extraImages", maxCount: 10 }
  ]),
  createRoom
);

router.put(
  "/:id",
  verifyToken,
  adminMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "extraImages", maxCount: 10 }
  ]),
  updateRoom
);

router.delete(
  "/:id",
  verifyToken,
  adminMiddleware,
  deleteRoom
);

module.exports = router;