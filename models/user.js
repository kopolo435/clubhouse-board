const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  img_url: { type: String, default: "/images/profiles/default-profile.jpg" },
  is_member: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: true },
});

UserSchema.virtual("url").get(function () {
  return `/account/profiles/${this.id}`;
});

UserSchema.virtual("fullname").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

UserSchema.virtual("numPost", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
  count: true,
});

UserSchema.virtual("numComments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
  count: true,
});

module.exports = mongoose.model("User", UserSchema);
