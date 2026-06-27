const mongoose = require("mongoose");
const { getNextSequenceValue } = require("./Counter");

const auditLogSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  timestamp: { type: Date, default: Date.now },
  adminName: { type: String, required: true },
  actionType: { type: String, required: true },
  details: { type: String, required: true },
  status: { type: String, default: "Success" }
});

auditLogSchema.pre("save", async function () {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("auditLogId");
  }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
