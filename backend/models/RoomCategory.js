const mongoose = require("mongoose");

const roomCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  parent: { type: String, default: null }, // e.g. "Villas", "Rooms", or null
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RoomCategory", roomCategorySchema);
