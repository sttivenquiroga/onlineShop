const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const DetailPurch = require("../models/detailPurchase");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");

router.post("/createDetailPurchase", Auth, UserAuth, async (req, res) => {
  if (
    !req.body.purchaseId ||
    !req.body.productId ||
    !req.body.amount ||
    !req.body.price
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(purchaseId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid purchase Id");
  validId = mongoose.Types.ObjectId.isValid(productId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product Id");
  const detailPurchase = new DetailPurch({
    purchaseId: req.body.purchaseId,
    productId: req.body.productId,
    amount: req.body.amount,
    price: req.body.price,
  });
  try {
    const result = await detailPurchase.save();
    if (!result)
      return res
        .status(400)
        .send("Process failed: Error creating detail purchase");
    return res.status(200).send({ result });
  } catch (e) {
    return res
      .status(400)
      .send("Process failed: Error creating detail purchase");
  }
});

router.get("/listDetailPurchase", Auth, UserAuth, Admin, async (req, res) => {
  const detailPurchases = await DetailPurch.find()
    .populate("purchaseId")
    .populate("productId")
    .exec();
  if (!detailPurchases)
    return res.status(400).send("Process failed: Detail purchases not found");
  res.status(200).send({ detailPurchases });
});

router.post(
  "/updateDetailPurchase",
  Auth,
  UserAuth,
  Admin,
  async (req, res) => {
    if (
      !req.body._id ||
      !req.body.purchaseId ||
      !req.body.productId ||
      !req.body.amount ||
      !req.body.price
    )
      return res.status(400).send("Process failed: Incomplete data");
    let validId = mongoose.Types.ObjectId.isValid(purchaseId);
    if (!validId)
      return res.status(400).send("Process failed: Invalid purchase Id");
    validId = mongoose.Types.ObjectId.isValid(productId);
    if (!validId)
      return res.status(400).send("Process failed: Invalid product Id");
    const detailPurchase = await DetailPurch.findByIdAndUpdate(req.body._id, {
      purchaseId: req.body.purchaseId,
      productId: req.body.productId,
      amount: req.body.amount,
      price: req.body.price,
    });
    if (!detailPurchase)
      return res
        .status(400)
        .send("Process failed: Error editing detail purchase");
    res.status(400).send({ detailPurchase });
  }
);

router.delete(
  "/deleteDetailPurchase/:_id",
  Auth,
  UserAuth,
  Admin,
  async (req, res) => {
    const detailPurchase = await DetailPurch.findByIdAndDelete(req.params._id);
    if (!detailPurchase)
      return res
        .status(400)
        .send("Process failed: Error deleting detail purchase");
    res.status(200).send("Process successful: Detail purchase deleted");
  }
);

module.exports = router;
