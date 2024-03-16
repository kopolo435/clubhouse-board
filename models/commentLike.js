const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentLikeSchema = new Schema({
  comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  is_positive_like: { type: Boolean, required: true },
});

module.exports = mongoose.model("CommentLike", commentLikeSchema);
