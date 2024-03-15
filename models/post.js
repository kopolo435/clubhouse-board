const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 30 },
  content: { type: String, required: true },
  img_url: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, default: 1 },
  date: { type: Date, default: Date.now },
});

PostSchema.virtual("formatted_date").get(function () {
  return DateTime.fromJSDate(this.date, { zone: "utc" }).toLocaleString(
    DateTime.DATE_MED
  );
});

PostSchema.virtual("url").get(function () {
  return `/blog/posts/${this._id}`;
});

PostSchema.virtual("numComments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true,
});

module.exports = mongoose.model("Post", PostSchema);
