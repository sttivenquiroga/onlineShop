const Role = require("../models/role");

const employee = async (req, res, next) => {
  const role = await Role.findById(req.user.roleId);
  if (!role)
    return res.status(400).send("Process failed: The role does not exist");
  if (role.name === "employee") next();
  else return res.status(400).send("Process failed: Unauthorized user");
};
module.exports = employee;