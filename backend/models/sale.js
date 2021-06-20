const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.ObjectId, ref: "user" },
  totalPrice: Number,
  accepted: Boolean,
  date: { type: Date, default: Date.now },
});

const sale = mongoose.model("sale", saleSchema);

module.exports = sale;
