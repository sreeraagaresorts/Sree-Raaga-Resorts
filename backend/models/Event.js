const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const eventSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  event_date: { type: String },
  description: { type: String },
  created_at: { type: Date, default: Date.now }
});

eventSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    try {
      this.id = await getNextSequenceValue("eventId");
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
