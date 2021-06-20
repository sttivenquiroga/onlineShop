const express = require("express");
const router = express.Router();
const Sale = require("../models/sale");
const mongoose = require("mongoose");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");
const Client = require("../middleware/client");

router.post("/createSale", Auth, UserAuth, Client, async (req, res) => {
  if (!req.body.totalPrice)
    return res.status(400).send("Process failed: Incomplete data");
  const sale = new Sale({
    clientId: req.user._id,
    totalPrice: req.body.totalPrice,
    accepted: true,
  });
  try {
    const result = await sale.save();
    if (!result)
      return res.status(400).send("Process failed: Error creating sale");
    return res.status(200).send({ result });
  } catch (e) {
    if (!result)
      return res.status(400).send("Process failed: Error creating sale");
  }
});

router.get("/listSaleAdmin", Auth, UserAuth, Admin, async (req, res) => {
  const sales = await Sale.find()
    .populate("clientId", "name")
    .exec();
  if (!sales) return res.status(400).send("Process failed: Not sales found");
  return res.status(200).send({ sales });
});

router.get("/listSaleClient", Auth, UserAuth, Client, async (req, res) => {
  const sales = await Sale.find({clientId: req.user._id})
    .populate("clientId", "name")
    .exec();
  if (!sales) return res.status(400).send("Process failed: Not sales found");
  return res.status(200).send({ sales });
});

router.put("/updateSale", Auth, UserAuth, Client, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.totalPrice
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Process failed: Invalid sale Id");
  const sale = await Sale.findByIdAndUpdate(req.body._id, {
    clientId: req.user._id,
    totalPrice: req.body.totalPrice,
    accepted: true,
  });
  if (!sale) return res.status(400).send("Process failed: Error editing sale");
  return res.status(200).send({ sale });
});

router.put("/deleteSale", Auth, UserAuth, Client, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.totalPrice
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Process failed: Invalid sale Id");
  const sale = await Sale.findByIdAndUpdate(req.body._id, {
    clientId: req.user._id,
    totalPrice: req.body.totalPrice,
    accepted: false,
  });
  if (!sale) return res.status(400).send("Process failed: Error editing sale");
  return res.status(200).send({ sale });
});

module.exports = router;
