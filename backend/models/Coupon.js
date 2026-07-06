const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discount_type: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },
    discount_value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: 0,
    },
    max_cap: {
      type: Number,
      default: null,
    },
    target_service: {
      type: String,
      enum: ["ALL", "ROOMS", "VILLAS", "EVENTS", "FOOD"],
      default: "ALL",
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    total_uses: {
      type: Number,
      default: 100,
    },
    uses_per_user: {
      type: Number,
      default: 1,
    },
    used_count: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "expired", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
