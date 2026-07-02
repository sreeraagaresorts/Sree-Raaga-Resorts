const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const dishSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  isVegetarian: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  isDrink: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

dishSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("dishId");
  }
});

module.exports = mongoose.model("Dish", dishSchema);
