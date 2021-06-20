const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProductType = require("../models/productType");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");

router.post("/createProductType", Auth, UserAuth, Admin, async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send("Process failed: Incomplete data");
  let prodType = await ProductType.findOne({ name: req.body.name });
  if (prodType)
    return res
      .status(400)
      .send("Process failed: Product type is already registered");
  prodType = new ProductType({
    name: req.body.name,
    description: req.body.description,
    active: true,
  });
  try {
    const result = await prodType.save();
    if (!result)
      return res
        .status(400)
        .send("Process failed: Error creating a product type");
    return res.status(200).send({ result });
  } catch (e) {
    return res
      .status(400)
      .send("Process failed: Error creating a product type");
  }
});

router.get(
  "/listProductType/:name?",
  Auth,
  UserAuth,
  Admin,
  async (req, res) => {
    const productTypes = await ProductType.find({
      name: new RegExp(req.params["name"], "i"),
    });
    if (!productTypes)
      return res.status(400).send("Process failed: Not product types found");
    return res.status(200).send({ productTypes });
  }
);

router.put("/updateProductType", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.description
  )
    return res.status(400).send("Process failed: Incomplete data");
  const validId =  mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Process failed: Invalid product type Id");
  const productType = await ProductType.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    active: true,
  });
  if (!productType)
    return res.status(400).send("Process failed: error editing Product Type");
  return res.status(200).send({ productType });
});

router.put("/deleteProductType", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.description
  )
    return res.status(400).send("Process failed: Incomplete data");
    const validId =  mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Process failed: Invalid product type Id");
    const productType = await ProductType.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    active: false,
  });
  if (!productType)
    return res.status(400).send("Process failed: error editing Product Type");
  return res.status(200).send({ productType });
});

module.exports = router;
