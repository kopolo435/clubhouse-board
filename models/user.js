const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  img_url: { type: String },
  is_member: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
