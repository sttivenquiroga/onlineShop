const mongoose = require("mongoose");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  roleId: { type: mongoose.Schema.ObjectId, ref: "role" },
  documentTypeId: { type: mongoose.Schema.ObjectId, ref: "documentType" },
  idNumber: String,
  phone: String,
  address: String,
  active: Boolean,
  date: { type: Date, default: Date.now },
});

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      roleId: this.roleId,
      iat: moment().unix(),
    },
    process.env.SECRET_KEY_JWT
  );
};

const user = mongoose.model("user", userSchema);

module.exports = user;
