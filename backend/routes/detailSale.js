const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const DetailSale = require("../models/detailSale");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");
const Client = require("../middleware/client");

router.post("/createDetailSale", Auth, UserAuth, Client, async (req, res) => {
  if (
    !req.body.saleId ||
    !req.body.productId ||
    !req.body.amount ||
    !req.body.price
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body.saleId);
  if (!validId) return res.status(400).send("Process failed: Invalid sale Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.productId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product Id");
  const detailSale = new DetailSale({
    saleId: req.body.saleId,
    productId: req.body.productId,
    amount: req.body.amount,
    price: req.body.price,
    acepted: true,
  });
  try {
    const result = await detailSale.save();
    if (!result)
      return res.status(400).send("Process failed: Error creating detail sale");
    return res.status(200).send({ result });
  } catch (e) {
    return res.status(400).send("Process failed: Error creating detail sale");
  }
});

router.get("/listDetailSale/:_id", Auth, UserAuth, Client, async (req, res) => {
  const detailSale = await DetailSale.find({ _id: req.params._id })
    .populate("saleId")
    .populate("productId")
    .exec();
  if (!detailSale)
    return res.status(400).send("Process failed: Detail sales not found");
  res.status(200).send({ detailSale });
});

router.get("/listDetailSaleAdmin", Auth, UserAuth, Admin, async (req, res) => {
  const detailSale = await DetailSale.find()
    .populate("saleId")
    .populate("productId")
    .exec();
  if (!detailSale)
    return res.status(400).send("Process failed: Detail sales not found");
  res.status(200).send({ detailSale });
});


router.put("/updateDetailSale", Auth, UserAuth, Client, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.saleId ||
    !req.body.productId ||
    !req.body.amount ||
    !req.body.price
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Process failed: Invalid detail sale Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.saleId);
  if (!validId) return res.status(400).send("Process failed: Invalid sale Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.productId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product Id");
  const detailSale = await DetailSale.findByIdAndUpdate(req.body._id, {
    saleId: req.body.saleId,
    productId: req.body.productId,
    amount: req.body.amount,
    price: req.body.price,
    acepted: true,
  });
  if (!detailSale)
    return res.status(400).send("Process failed: Error editing detail sale");
  res.status(400).send({ detailSale });
});

router.put("/deleteDetailSale", Auth, UserAuth, Client, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.saleId ||
    !req.body.productId ||
    !req.body.amount ||
    !req.body.price
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Process failed: Invalid detail sale Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.saleId);
  if (!validId) return res.status(400).send("Process failed: Invalid sale Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.productId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product Id");
  const detailSale = await DetailSale.findByIdAndUpdate(req.body._id, {
    saleId: req.body.saleId,
    productId: req.body.productId,
    amount: req.body.amount,
    price: req.body.price,
    acepted: false,
  });
  if (!detailSale)
    return res.status(400).send("Process failed: Error editing detail sale");
  res.status(400).send({ detailSale });
});

module.exports = router;
