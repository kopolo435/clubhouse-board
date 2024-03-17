const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const { Schema } = mongoose;

const CommentsSchema = new Schema({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  points: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

CommentsSchema.virtual("formatted_date").get(function () {
  return DateTime.fromJSDate(this.date, { zone: "utc" }).toLocaleString(
    DateTime.DATE_MED
  );
});

module.exports = mongoose.model("Comment", CommentsSchema);
