const Role = require("../models/role");

const client = async (req, res, next) => {
  const role = await Role.findById(req.user.roleId);
  if (!role)
    return res.status(400).send("Process failed: The role does not exist");
  if (role.name === "client") next();
  else return res.status(400).send("Process failed: Unauthorized user");
};
module.exports = client;