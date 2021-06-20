const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");

router.post("/createProduct", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body.name ||
    !req.body.productTypeId ||
    !req.body.description ||
    !req.body.purchasePrice ||
    !req.body.salePrice
  )
    return res.status(400).send("Process failed: Incomplete data");
  let product = await Product.findOne({ name: req.body.name });
  if (product)
    return res
      .status(400)
      .send("Process failed: The product is already registered");
  const validId = mongoose.Types.ObjectId.isValid(req.body.productTypeId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product type Id");
  product = new Product({
    name: req.body.name,
    productTypeId: req.body.productTypeId,
    description: req.body.description,
    purchasePrice: req.body.purchasePrice,
    salePrice: req.body.salePrice,
    active: true,
  });
  try {
    const result = await product.save();
    if (!result)
      return res.status(400).send("Process failed: Error creating product");
    return res.status(200).send({ result });
  } catch (e) {
    if (!result)
      return res.status(400).send("Process failed: Error creating product");
  }
});

router.get("/listProduct/:name?", Auth, UserAuth, Admin, async (req, res) => {
  const products = await Product.find({
    name: new RegExp(req.params["name"], "i"),
  })
    .populate("productTypeId")
    .exec();
  if (!products)
    return res.status(400).send("Process failed: Products not found");
  return res.status(200).send({ products });
});

router.put("/updateProduct", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.productTypeId ||
    !req.body.description ||
    !req.body.purchasePrice ||
    !req.body.salePrice
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.productTypeId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product type Id");
  let product = await Product.findOne({ name: req.body.name });
  if (product && req.body._id != product._id)
    return res
      .status(400)
      .send("Process failed: The product is already registered");
  product = await Product.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    productTypeId: req.body.productTypeId,
    description: req.body.description,
    purchasePrice: req.body.purchasePrice,
    salePrice: req.body.salePrice,
    active: true,
  });
  if (!product)
    return res.status(400).send("Process failed: Error editing product");
  return res.status(200).send({ product });
});

router.put("/deleteProduct", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.productTypeId ||
    !req.body.description ||
    !req.body.purchasePrice ||
    !req.body.salePrice
  )
    return res.status(400).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.productTypeId);
  if (!validId)
    return res.status(400).send("Process failed: Invalid product type Id");
  let product = await Product.findOne({ name: req.body.name });
  if (product && req.body._id != product._id)
    return res
      .status(400)
      .send("Process failed: The product is already registered");
  product = await Product.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    productTypeId: req.body.productTypeId,
    description: req.body.description,
    purchasePrice: req.body.purchasePrice,
    salePrice: req.body.salePrice,
    active: false,
  });
  if (!product)
    return res.status(400).send("Process failed: Error deleting product");
  return res.status(200).send("Process successful: Product deleted");
});

module.exports = router;
