const express = require("express");
const router = express.Router(),
const Sale = require("../models/sale");
const mongoose = require("mongoose");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");

router.post("/createSale", Auth, UserAuth, async (req,res) => {
    if (!req.body.clientId || !req.body.sellerId || !req.body.totalPrice) return res.status(400).send("Process failed: Incomplete data");
    let validId = mongoose.Types.ObjectId.isValid(req.body.clientId);
    if (!validId) return res.status(400).send("Process failed: Invalid client Id");
    validId = mongoose.Types.ObjectId.isValid(req.body.sellerId);
    if (!validId) return res.status(400).send("Process failed: Invalid seller Id");
    const sale = new Sale({
        clientId: req.body.clientId,
        sellerId: req.body.sellerId,
        totalPrice: req.body.totalPrice,
        status: "efective"
    });
    try {
        const result = await sale.save();
        if (!result) return res.status(400).send("Process failed: Error creating sale");
        return res.status(200).send({result});
    } catch (e) {
        if (!result) return res.status(400).send("Process failed: Error creating sale");
    }
});

router.get("/listSale/:_id?", Auth, UserAuth, Admin, async(req, res) =>{
    const sales = await Sale.find({_id: new RegExp(req.params["_id"], "i")}).populate("clientId", "name").populate("sellerId", "name").exec();
    if (!sales) return res.status(400).send("Process failed: Not sales found");
    return res.status(200).send({sales});
});

router.put("/updateSale", Auth, UserAuth, Admin, async(req, res)=> {
    if (!req.body._id ||!req.body.clientId || !req.body.sellerId || !req.body.totalPrice || !req.body.status) return res.status(400).send("Process failed: Incomplete data");
    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Process failed: Invalid sale Id");
    validId = mongoose.Types.ObjectId.isValid(req.body.clientId);
    if (!validId) return res.status(400).send("Process failed: Invalid client Id");
    validId = mongoose.Types.ObjectId.isValid(req.body.sellerId);
    if (!validId) return res.status(400).send("Process failed: Invalid seller Id");
    const sale = await Sale.findByIdAndUpdate(req.body._id, {
        clientId: req.body.clientId,
        sellerId: req.body.sellerId,
        totalPrice: req.body.totalPrice,
        status: req.body.status,
    });
    if (!sale) return res.status(400).send("Process failed: Error editing sale");
    return res. status(200).send({sale});
});

router.put("/deleteSale", Auth, UserAuth, Admin, async(req, res)=> {
    if (!req.body._id ||!req.body.clientId || !req.body.sellerId || !req.body.totalPrice) return res.status(400).send("Process failed: Incomplete data");
    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Process failed: Invalid sale Id");
    validId = mongoose.Types.ObjectId.isValid(req.body.clientId);
    if (!validId) return res.status(400).send("Process failed: Invalid client Id");
    validId = mongoose.Types.ObjectId.isValid(req.body.sellerId);
    if (!validId) return res.status(400).send("Process failed: Invalid seller Id");
    const sale = await Sale.findByIdAndUpdate(req.body._id, {
        clientId: req.body.clientId,
        sellerId: req.body.sellerId,
        totalPrice: req.body.totalPrice,
        status: "void"
    });
    if (!sale) return res.status(400).send("Process failed: Error editing sale");
    return res. status(200).send({sale});
});

module.exports = router;