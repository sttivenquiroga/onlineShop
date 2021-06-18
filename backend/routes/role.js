const express = require("express");
const router = express.Router();
const Role = require("../models/role");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");

router.post("/createRole", Auth, UserAuth, Admin, async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send("Process failed: Incomplete data");
  let role = await Role.find({ name: req.body.name });
  if (role)
    return res
      .status(400)
      .send("Process failed: The role is already registered");
  role = new Role({
    name: req.body.name,
    description: req.body.description,
    active: true,
  });
  try {
    const result = await role.save();
    if (!result)
      return res.status(400).send("Process failed: Error creating role");
    return res.status(200).send({ result });
  } catch (e) {
    return res.status(400).send("Process failed. Error creating role");
  }
});

router.get("/listRole/:name?", Auth, UserAuth, Admin, async (req, res) => {
  const roles = await Role.find({ name: new RegExp(req.params["name"], "i") });
  if (!roles) return res.status(400).send("Process failed: Not roles found");
  return res.status(400).send({ roles });
});

router.put("/updateRole", Auth, UserAuth, Admin, async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.description)
    return res.status(400).send("Process failed: Incomplete data");
  let role = await Role.find({ name: req.body.name });
  if (role && role._id != req.body._id)
    return res
      .status(400)
      .send("Process failed: The role is already registered");
  role = await Role.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    active: true,
  });
  if (!role) return res.status(400).send("Process failed: Error editing role");
  return res.status(200).send({ role });
});

router.put("/deleteRole", Auth, UserAuth, Admin, async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.description)
    return res.status(400).send("Process failed: Incomplete data");
  let role = await Role.find({ name: req.body.name });
  if (role && role._id != req.body._id)
    return res
      .status(400)
      .send("Process failed: The role is already registered");
  role = await Role.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    active: false,
  });
  if (!role) return res.status(400).send("Process failed: Error deleting role");
  return res.status(200).send({ role });
});

module.exports = router;