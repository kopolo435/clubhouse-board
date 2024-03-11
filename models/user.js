const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  img_url: { type: String, default: "placeholder" },
  is_member: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
