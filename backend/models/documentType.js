const mongoose = require("mongoose");

const docTypeSchema = new mongoose.Schema({
  name: String,
  description: String,
  active: Boolean,
  date: { type: Date, default: Date.now() },
});

const documentType = mongoose.model("documentType", docTypeSchema);

module.exports = documentType;

