const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const roomSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  roomNumber: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  gst_percentage: { type: Number, default: 8 },
  image: { type: String },
  images: { type: [String], default: [] },
  category: { type: String, default: "Executive Rooms" },
  totalRooms: { type: Number, default: 1 },
  roomStatuses: {
    type: [
      {
        roomNumber: { type: String, required: true },
        status: { type: String, enum: ["Available", "Occupied", "Reserved", "Maintenance"], default: "Available" },
        floor: { type: Number, default: 1 }
      }
    ],
    default: []
  },
  area: { type: String },
  beds: { type: String },
  bathrooms: { type: String },
  guests: { type: String },
  description: { type: String },
  view360Iframe: { type: String },
  created_at: { type: Date, default: Date.now }
});

roomSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("roomId");
  }
});

module.exports = mongoose.model("Room", roomSchema);
