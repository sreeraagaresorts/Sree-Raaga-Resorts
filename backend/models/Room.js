const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const roomSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  area: { type: Number },
  beds: { type: Number },
  bathrooms: { type: Number },
  description: { type: String },
  created_at: { type: Date, default: Date.now }
});

roomSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    try {
      this.id = await getNextSequenceValue("roomId");
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Room", roomSchema);
