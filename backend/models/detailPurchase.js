const mongoose = require("mongoose");

const detailPurchSchema = new mongoose.Schema({
  purchaseId: { type: mongoose.Schema.ObjectId, ref: "purchase" },
  productId: { type: mongoose.Schema.ObjectId, ref: "product" },
  amount: Number,
  price: Number,
  date: { type: Date, default: Date.now },
});
const detailPurchase = mongoose.model("detailPurchase", detailPurchSchema);

module.exports = detailPurchase;
