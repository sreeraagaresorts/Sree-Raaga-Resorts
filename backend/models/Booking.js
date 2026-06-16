const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const bookingSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  user_id: { type: Number, required: true },
  room_id: { type: Number, required: true },
  check_in: { type: Date, required: true },
  check_out: { type: Date, required: true },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  total_price: { type: Number, required: true },
  status: { type: String, default: "pending" },
  payment_method: { type: String, default: "online" },
  created_at: { type: Date, default: Date.now }
});

bookingSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("bookingId");
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
