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

eventSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("eventId");
  }
});

module.exports = mongoose.model("Event", eventSchema);
