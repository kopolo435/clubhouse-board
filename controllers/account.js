const asyncHandler = require("express-async-handler");
const User = require("../models/user");
// Sign up get request
module.exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign_up");
});
