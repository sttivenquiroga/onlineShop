const mongoose = require("mongoose");

const detailSaleSchema = new mongoose.Schema({
  saleId: { type: mongoose.Schema.ObjectId, ref: "sale" },
  productId: { type: mongoose.Schema.ObjectId, ref: "product" },
  amount: Number,
  price: Number,
  data: { type: Date, default: Date.now },
});

const detailSale = mongoose.model("detailSale", detailSaleSchema);

module.exports = detailSale;
