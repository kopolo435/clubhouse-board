const mongoose = require("mongoose");

const { Schema } = mongoose;

const postLikeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "User", required: true },
  is_positive_like: { type: Boolean, required: true },
});

module.exports = mongoose.model("Like", postLikeSchema);
