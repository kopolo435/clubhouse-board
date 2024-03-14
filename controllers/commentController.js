const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");

module.exports.create_comment = [
  body("comment")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Error, no puede escribir un comentario vacio"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const comment = new Comment({
      content: req.body.comment,
      user: req.body.userId,
      post: req.body.postId,
    });

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.mapped().comment });
    } else {
      await comment.save();
      res.status(200).json({ message: "Comentario guardado" });
    }
  }),
];
