const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.ObjectId, ref: "user" },
  buyerId: { type: mongoose.Schema.ObjectId, ref: "user" },
  totalPrice: Number,
  date: { type: Date, default: Date.now },
});

const purchase = mongoose.model("purchase", purchaseSchema);

module.exports = purchase;
