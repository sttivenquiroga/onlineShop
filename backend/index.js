const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/db");
require("dotenv").config();

const User = require("./routes/user");
const Auth = require("./routes/auth");
const DetailPurchase = require("./routes/detailPurchase");
const DetailSale = require("./routes/detailSale");
const DocumentType = require("./routes/documentType");
const Product = require("./routes/product");
const ProductType = require("./routes/productType");
const Purchase = require("./routes/purchase");
const Role = require("./routes/role");
const Sale = require("./routes/sale");
const Stock = require("./routes/stock");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/user/", User);
app.use("/api/auth/", Auth);
app.use("/api/detailPurchase/", DetailPurchase);
app.use("/api/detailSale/", DetailSale);
app.use("/api/documentType/", DocumentType);
app.use("/api/product/", Product);
app.use("/api/productType/", ProductType);
app.use("/api/purchase/", Purchase);
app.use("/api/role/", Role);
app.use("/api/sale/", Sale);
app.use("/api/stock/", Stock);

app.listen(process.env.PORT, () => {
  console.log("Backend server running on port " + process.env.PORT);
});

dbConnection();
