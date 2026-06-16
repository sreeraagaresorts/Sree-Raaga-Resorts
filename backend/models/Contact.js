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

contactSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    try {
      this.id = await getNextSequenceValue("contactId");
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Contact", contactSchema);
