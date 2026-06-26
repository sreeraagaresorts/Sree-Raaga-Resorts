const express = require("express");

const router = express.Router();

const upload =
require("../middleware/upload");

const verifyToken =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  createEnquiry,
  getEnquiries,
  deleteEnquiry
} = require("../controllers/eventController");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/", getEvents);

router.get("/:id", getEvent);

router.post("/enquiries", createEnquiry);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  verifyToken,
  adminMiddleware,
  upload.single("image"),
  createEvent
);

router.put(
  "/:id",
  verifyToken,
  adminMiddleware,
  upload.single("image"),
  updateEvent
);

router.delete(
  "/:id",
  verifyToken,
  adminMiddleware,
  deleteEvent
);

router.get(
  "/enquiries/admin",
  verifyToken,
  adminMiddleware,
  getEnquiries
);

router.delete(
  "/enquiries/admin/:id",
  verifyToken,
  adminMiddleware,
  deleteEnquiry
);

module.exports = router;