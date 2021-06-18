const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  productTypeId: { type: mongoose.Schema.ObjectId, ref: "documentType" },
  description: String,
  purchasePrice: Number,
  salePrice: Number,
  active: Boolean,
  date: { type: Date, default: Date.now },
});

const product = mongoose.model("product", productSchema);

module.exports = product;
