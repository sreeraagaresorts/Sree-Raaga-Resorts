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
  deleteRoom,
  getRoomAvailability,
  updateRoomUnitStatus,
  addRoomUnit,
  updateRoomUnit,
  deleteRoomUnit
} = require("../controllers/roomController");

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get("/", getRooms);

router.get("/:id", getRoom);

router.get("/:id/availability", getRoomAvailability);

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

router.put(
  "/:id/status",
  verifyToken,
  adminMiddleware,
  updateRoomUnitStatus
);

router.post(
  "/add-unit",
  verifyToken,
  adminMiddleware,
  addRoomUnit
);

router.put(
  "/:id/unit",
  verifyToken,
  adminMiddleware,
  updateRoomUnit
);

router.delete(
  "/:id/unit/:roomNumber",
  verifyToken,
  adminMiddleware,
  deleteRoomUnit
);

module.exports = router;