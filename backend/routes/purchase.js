const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchase");
const mongoose = require("mongoose");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");
const Employee = require("../middleware/employee");
const Provider = require("../middleware/provider");

router.post("/createPurchase", Auth, UserAuth, Employee, async (req, res) => {
  if (!req.body.providerId || !req.body.totalPrice)
    return res.status(400).send("Process failed: Incomplete data");
  const validId = mongoose.Types.ObjectId.isValid(req.body.providerId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid client Id");
  const purchase = new Purchase({
    providerId: req.body.providerId,
    buyerId: req.user._id,
    totalPrice: req.body.totalPrice,
    accepted: false,
  });
  try {
    const result = await purchase.save();
    if (!result)
      return res.status(400).send("Process failed: Error creating purchase");
    return res.status(200).send({ result });
  } catch (e) {
    if (!result)
      return res.status(400).send("Process failed: Error creating purchase");
  }
});

router.get("/listPurchaseAdmin", Auth, UserAuth, Admin, async (req, res) => {
  const purchases = await Purchase.find()
    .populate("providerId", "name")
    .populate("buyerId", "name")
    .exec();
  if (!purchases)
    return res.status(400).send("Process failed: Not purchases found");
  return res.status(200).send({ purchases });
});

router.get("/listPurchase", Auth, UserAuth, Provider, async (req, res) => {
  const purchases = await Purchase.find({ providerId: req.user._id })
    .populate("providerId", "name")
    .populate("buyerId", "name")
    .exec();
  if (!purchases)
    return res.status(400).send("Process failed: Not purchases found");
  return res.status(200).send({ purchases });
});

router.put("/updatePurchase", Auth, UserAuth, Employee, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.providerId ||
    !req.body.totalPrice
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Process failed: Invalid purchase Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.providerId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid client Id");
  const purchase = await Purchase.findByIdAndUpdate(req.body._id, {
    providerId: req.body.providerId,
    buyerId: req.user._id,
    totalPrice: req.body.totalPrice,
    accepted: false,
  });
  if (!purchase)
    return res.status(400).send("Process failed: Error editing purchase");
  return res.status(200).send({ purchase });
});

router.put("/acceptPurchaseProvider", Auth, UserAuth, Provider, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.providerId ||
    !req.body.buyerId ||
    !req.body.totalPrice
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Process failed: Invalid purchase Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.providerId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid client Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.buyerId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid seller Id");
  const purchase = await Purchase.findByIdAndUpdate(req.body._id, {
    providerId: req.body.providerId,
    buyerId: req.body.buyerId,
    totalPrice: req.body.totalPrice,
    accepted: true,
  });
  if (!purchase)
    return res.status(400).send("Process failed: Error editing purchase");
  return res.status(200).send({ purchase });
});

router.put("/deletePurchase", Auth, UserAuth, Employee, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.providerId ||
    !req.body.buyerId ||
    !req.body.totalPrice
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Process failed: Invalid purchase Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.providerId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid client Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.buyerId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid seller Id");
  const purchase = await Purchase.findByIdAndUpdate(req.body._id, {
    providerId: req.body.providerId,
    buyerId: req.body.buyerId,
    totalPrice: req.body.totalPrice,
    accepted: false,
  });
  if (!purchase) return res.status(400).send("Process failed: Error editing sale");
  return res.status(200).send({ purchase });
});

module.exports = router;
