const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const contactSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

contactSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("contactId");
  }
});

module.exports = mongoose.model("Contact", contactSchema);
