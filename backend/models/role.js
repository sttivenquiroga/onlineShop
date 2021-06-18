const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: String,
    description: String,
    active: Boolean,
    date: {type: Date, default: Date.now}
});

const role = mongoose.model("role", roleSchema);

module.exports = role;