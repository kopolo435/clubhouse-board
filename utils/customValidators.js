const User = require("../models/user");

module.exports.isEmailInUse = async function isEmailInUse(value) {
  const user = await User.findOne({ email: value }).exec();
  if (user) {
    throw new Error("Erorr, el correo ingresado ya se encuentra en uso");
  }
};

module.exports.isPasswordEqual = function isPasswordEqual(value, { req }) {
  return value === req.body.password;
};

module.exports.isUsernameInUse = async function isUsernameInUse(value) {
  const user = await User.findOne({ username: value }).exec();
  if (user) {
    throw new Error("Error, el nombre de usuario ya se encuentra en uso");
  }
};

module.exports.isUpdatedEmailInUse = async function isUpdatedEmailInUse(
  value,
  { req }
) {
  const user = await User.findOne({ email: value }).exec();
  if (user && user.id !== req.params.id) {
    throw new Error("Error, el nombre de usuario ya se encuentra en uso");
  }
};

module.exports.isUpdatedUsernameInUse = async function isUpdatedEmailInUse(
  value,
  { req }
) {
  const user = await User.findOne({ username: value }).exec();
  if (user && user.id !== req.params.id) {
    throw new Error("Error, el nombre de usuario ya se encuentra en uso");
  }
};
