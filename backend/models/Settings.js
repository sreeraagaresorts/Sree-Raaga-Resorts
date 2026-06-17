const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  resortName: { type: String, default: "Sree Raaga Resort" },
  contactEmail: { type: String, default: "support@sreeraagaresorts.in" },
  contactPhone: { type: String, default: "+91 98765 43210" },
  address: { type: String, default: "Bypass Road, Main Highway, Kochi, Kerala" },
  checkInTime: { type: String, default: "12:00 PM" },
  checkOutTime: { type: String, default: "11:00 AM" },
  gstRate: { type: Number, default: 12 },
  minAdvanceDays: { type: Number, default: 1 },
  enableEmailAlerts: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Settings", settingsSchema);
