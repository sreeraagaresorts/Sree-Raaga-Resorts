const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const roomSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  roomNumber: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, default: "Executive Rooms" },
  area: { type: String },
  beds: { type: String },
  bathrooms: { type: String },
  description: { type: String },
  created_at: { type: Date, default: Date.now }
});

roomSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("roomId");
  }
});

module.exports = mongoose.model("Room", roomSchema);
