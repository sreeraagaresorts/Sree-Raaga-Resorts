const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const foodOrderSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  dishName: { type: String, required: true },
  quantity: { type: Number, default: 1, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  roomNumber: { type: String, required: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String },
  specialInstructions: { type: String },
  status: { 
    type: String, 
    default: "pending",
    enum: ["pending", "preparing", "delivered", "cancelled"]
  },
  created_at: { type: Date, default: Date.now }
});

foodOrderSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("foodOrderId");
  }
});

module.exports = mongoose.model("FoodOrder", foodOrderSchema);
