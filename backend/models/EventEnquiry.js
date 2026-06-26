const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const eventEnquirySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  eventName: { type: String, required: true },
  guests: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

eventEnquirySchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("eventEnquiryId");
  }
});

module.exports = mongoose.model("EventEnquiry", eventEnquirySchema);
