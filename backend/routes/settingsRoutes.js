const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get settings - Admin only
router.get("/", verifyToken, adminMiddleware, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings"
    });
  }
});

// Update settings - Admin only
router.put("/", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.json({
      success: true,
      message: "Settings updated successfully",
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update settings"
    });
  }
});

module.exports = router;
