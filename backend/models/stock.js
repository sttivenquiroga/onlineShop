const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.ObjectId, ref: "product"},
    amount: Number,
    active: Boolean,
    date: {type: Date, default: Date.now}
});

const stock = mongoose.model("stock", stockSchema);

module.exports = stock; 