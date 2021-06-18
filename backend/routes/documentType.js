const express = require("express");
const router = express.Router();
const DocType = require("../models/documentType");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");

router.post("/createDocumentType", Auth, UserAuth, Admin, async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send("Process failed: Incomplete data");
  let doctype = await DocType.find({ name: req.body.name });
  if (doctype)
    return res
      .status(400)
      .send("Process failed: Document type is already registered");
  doctype = new DocType({
    name: req.body.name,
    description: req.body.description,
    active: true,
  });
  try {
    const result = doctype.save();
    if (!result)
      return res
        .status(400)
        .send("Process failed: Error creating Document Type");
    return res.status(200).send({ result });
  } catch (e) {
    return res.status(400).send("Process failed: Error creating Document Type");
  }
});

router.get(
  "/listDocumentType/:name?",
  Auth,
  UserAuth,
  Admin,
  async (req, res) => {
    const docTypes = await DocType.find({
      name: new RegExp(req.params["name"], "i"),
    });
    if (!docTypes)
      return res.status(400).send("Process failed: Not document types found");
    return res.status(200).send({ docTypes });
  }
);

router.put("/updateDocumentType", Auth, UserAuth, Admin, async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.description)
    return res.status(400).send("Process failed: Incomplete data");
  const doctype = await DocType.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    active: true,
  });
  if (!doctype)
    return res.status(400).send("Process failed: Error editing Document Type");
  return res.status(200).send({ doctype });
});

router.put("/deleteDocumentType", Auth, UserAuth, Admin, async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.description)
    return res.status(400).send("Process failed: Incomplete data");
  const doctype = await DocType.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    active: false,
  });
  if (!doctype)
    return res.status(400).send("Process failed: Error deleting Document Type");
  return res.status(200).send("Process sucessful: Document Type deleted");
});

module.exports = router;