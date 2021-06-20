const express = require("express");
const router = express.Router();
const Stock = require("../models/stock");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");
const mongoose = require("mongoose");

router.post("createStock", Auth, UserAuth, Admin, async (req, res) => {
  if (!productId || !amount)
    return res.status(400).send("Process failed: Incomplete data");
  const validId = mongoose.Types.ObjectId.isValid(req.body.productId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product Id");
  const stock = new Stock({
    productId: req.body.productId,
    amount: req.body.amount,
    active: true,
  });
  try {
    const result = await stock.save();
    if (!result)
      return res.status(400).send("Process failed: Error creating stock");
    return res.status(200).send({ result });
  } catch (e) {
    if (!result)
      return res.status(400).send("Process failed: Error creating stock");
  }
});

router.get(
  "/listStock/:productId?",
  Auth,
  UserAuth,
  Admin,
  async (req, res) => {
    const stocks = await Stock.find({
      productId: new RegExp(req.params["productId"], "i"),
    })
      .populate("productId")
      .exec();
    if (!stocks) return res.status(400).send("Not products found");
    return res.status(200).send({ stocks });
  }
);

router.put("/updateStock", Auth, UserAuth, Admin, async (req, res) => {
  if (!req.body._id || !req.body.productId || !req.body.amount)
    return res.status(400).send("Process failed: Incomplete data");
  const validId = mongoose.Types.ObjectId.isValid(req.body.productId);
  if (!validId)
    return res.status(200).send("Process failed: Invalid product Id");
  const stock = await Stock.findByIdAndUpdate(req.body._id, {
    productId: req.body.productId,
    amount: req.body.amount,
    active: true,
  });
  if (!stock)
    return res.status(400).send("Process failed: Error editing stock");
  return res.status(200).send({ stock });
});

router.put("/deleteStock", Auth, UserAuth, Admin, async (req, res) => {
  if (!req.body._id || !req.body.productId || !req.body.amount)
    return res.status(400).send("Process failed: Incomplete data");
  const validId = mongoose.Types.ObjectId.isValid(req.body.productId);
  if (!validId)
    return res.status(200).send("Process failed: Invalid product Id");
  const stock = await Stock.findByIdAndUpdate(req.body._id, {
    productId: req.body.productId,
    amount: req.body.amount,
    active: false,
  });
  if (!stock)
    return res.status(400).send("Process failed: Error editing stock");
  return res.status(200).send({ stock });
});

module.exports = router;
