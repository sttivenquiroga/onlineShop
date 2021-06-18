const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.ObjectId, ref: "user" },
  sellerId: { type: mongoose.Schema.ObjectId, ref: "user" },
  totalPrice: Number,
  status: String,
  date: { type: Date, default: Date.now },
});

const sale = mongoose.model("sale", saleSchema);

module.exports = sale;
