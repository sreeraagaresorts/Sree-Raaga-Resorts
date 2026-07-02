const mongoose = require("mongoose");

const roomCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  parent: { type: String, default: null }, // e.g. "Villas", "Rooms", or null
  order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RoomCategory", roomCategorySchema);
