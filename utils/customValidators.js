const User = require("../models/user");

module.exports.isEmailInUse = async function isEmailInUse(value) {
  const user = await User.findOne({ email: value }).exec();
  return !user;
};

module.exports.isPasswordEqual = function isPasswordEqual(value, { req }) {
  return value === req.body.password;
};
