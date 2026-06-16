const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  created_at: { type: Date, default: Date.now }
});

userSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("userId");
  }
});

module.exports = mongoose.model("User", userSchema);
