const mongoose = require("mongoose");

const prodTypeSchema = new mongoose.Schema({
  name: String,
  description: String,
  active: Boolean,
  date: { type: Date, default: Date.now },
});

const productType = mongoose.model("productType", prodTypeSchema);

module.exports = productType;
