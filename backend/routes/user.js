const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Role = require("../models/role");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");
const DocType = require("../models/documentType");
const bcrypt = require("bcrypt");

router.post("/registerClient", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password ||
    !req.body.documentTypeId ||
    !req.body.idNumber ||
    !req.body.phone ||
    !req.body.address
  )
    return res.status(400).send("Process failed: Incomplete data");
  let user = await User.findOne({ username: req.body.username });
  if (user)
    return res
      .status(400)
      .send("Process failed: Username is already registered");
  user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("Process failed: Email is already registered");
  let doctype = await DocType.findOne({ name: req.body.documentTypeId });
  if (!doctype)
    return res.status(400).send("Process failed: Document type not found");
  const role = await Role.findOne({ name: "user" });
  if (!role)
    return res.status(400).send("Process failed: No role was assigned");
  const hash = await bcrypt.hash(req.body.password, 10);
  user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hash,
    roleId: role._id,
    documentTypeId: doctype._id,
    idNumber: req.body.idNumber,
    phone: req.body.phone,
    address: req.body.address,
    active: true,
  });
  try {
    const result = await user.save();
    if (!result)
      return res.status(400).send("Process failed: Error creating user");
    const jwt = user.generateJWT();
    return res.status(200).send({ jwt });
  } catch (e) {
    return res.status(400).send("Process failed: Error creating user");
  }
});

router.post("/registerUsers", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body.name ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId ||
    !req.body.documentTypeId ||
    !req.body.idNumber ||
    !req.body.phone ||
    !req.body.address
  )
    return res.status(400).send("Process failed: Incomplete date");
  let user = await User.findOne({ username: req.body.username });
  if (user)
    return res
      .status(400)
      .send("Process failed: Username is already registered");
  user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("Process failed: Email is already registered");
  const validRole = mongoose.Types.ObjectId.isValid(req.body.roleId);
  if (!validRole) return res.status(400).send("Process failed: Invalid roleId");
  const docType = await DocType.findOne({ name: req.body.documentTypeId });
  if (!docType)
    return res.status(400).send("Process failed: Document type not found");
  const hash = await bcrypt.hash(req.body.password, 10);
  user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hash,
    roleId: req.body.roleId,
    documentTypeId: docType._id,
    idNumber: req.body.idNumber,
    phone: req.body.phone,
    address: req.body.address,
    active: true,
  });
  try {
    const result = user.save();
    if (!user)
      return res.status(400).send("Process failed: Error creating user");
    const jwtToken = user.generateJWT();
    res.status(200).send({ jwtToken });
  } catch (e) {
    return res.status(400).send("Process failed: Error creating user");
  }
});

router.get("/listUsers/:name?", Auth, UserAuth, Admin, async (req, res) => {
  const users = await User.find({ name: new RegExp(req.params["name"], "i") })
    .populate("roleId")
    .populate("documentTypeId")
    .exec();
  if (!users) return res.status(400).send("Process failed: Users not found");
  return res.status(200).send({ users });
});

router.put("/updateUser", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId ||
    !req.body.documentTypeId ||
    !req.body.idNumber ||
    !req.body.phone ||
    !req.body.address
  )
    return res.status(400).send("Process failed: Incomplete data");
  const validRole = mongoose.Types.ObjectId.isValid(req.body.roleId);
  if (!validRole) return res.status(400).send("Process failed: Invalid roleId");
  const docType = await DocType.findOne({ name: req.body.documentTypeId });
  if (!docType)
    return res.status(400).send("Process failed: Document type not found");
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    username: req.body.username,
    email: req.body.username,
    password: hash,
    roleId: req.body.roleId,
    documentTypeId: docType._id,
    idNumber: req.body.idNumber,
    phone: req.body.phone,
    address: req.body.address,
    active: true,
  });
  if (!user) return res.status(400).send("Process failed: Error editing user");
  return res.status(200).send({ user });
});

router.put("/deleteUser", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId ||
    !req.body.documentTypeId ||
    !req.body.idNumber ||
    !req.body.phone ||
    !req.body.address
  )
    return res.status(400).send("Process failed: Incomplete data");
  const validRole = mongoose.Types.ObjectId.isValid(req.body.roleId);
  if (!validRole) return res.status(400).send("Process failed: Invalid roleId");
  const docType = await DocType.findOne({ name: req.body.documentTypeId });
  if (!docType)
    return res.status(400).send("Process failed: Document type not found");
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    username: req.body.username,
    email: req.body.username,
    password: hash,
    roleId: req.body.roleId,
    documentTypeId: docType._id,
    idNumber: req.body.idNumber,
    phone: req.body.phone,
    address: req.body.address,
    active: false,
  });
  if (!user) return res.status(400).send("Process failed: Error deleting user");
  return res.status(200).send({ user });
});

module.exports = router;
