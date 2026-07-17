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
  rooms: { type: Number, default: 1 },
  room_number: { type: String, default: null },
  total_price: { type: Number, required: true },
  status: { type: String, default: "confirmed" },
  payment_method: { type: String, default: "online" },
  payment_status: { type: String, default: "Paid" },
  razorpay_payment_id: { type: String, default: null },
  subtotal: { type: Number, default: 0 },
  services_price: { type: Number, default: 0 },
  discount_price: { type: Number, default: 0 },
  gst_amount: { type: Number, default: 0 },
  coupon_code: { type: String, default: null },
  booking_source: { type: String, default: "Walk-in" },
  is_manual: { type: Boolean, default: false },
  extraBed: { type: Boolean, default: false },
  cancellation_reason: { type: String, default: null },
  checked_in_at: { type: Date, default: null },
  checked_out_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now }
});

bookingSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("bookingId");
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
