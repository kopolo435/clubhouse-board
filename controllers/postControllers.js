const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const path = require("path");
const Post = require("../models/post");
const Comments = require("../models/comment");
const upload = require("../utils/uploadImg");

module.exports.create_post_get = asyncHandler(async (req, res, next) => {
  res.render("create_post", { errors: {}, post: {} });
});

module.exports.create_post_post = [
  upload.single("img"),
  body("title")
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage("Error, el titulo debe tener al menos 5 caracteres"),
  body("content")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Error, debe ingresar el contenido del post"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let post;
    if (req.file) {
      post = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.user.id,
        img_url: `/${path.relative("public", req.file.path)}`,
      });
    } else {
      post = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.user.id,
      });
    }

    if (!errors.isEmpty()) {
      res.render("create_post", { errors: errors.mapped(), post });
    } else {
      await post.save();
      res.redirect(post.url);
    }
  }),
];

module.exports.show_post_details = asyncHandler(async (req, res, next) => {
  const [post, comments] = await Promise.all([
    Post.findById(req.params.id).populate("user").exec(),
    Comments.find({ post: req.params.id }).populate("user").exec(),
  ]);

  if (!post) {
    const err = new Error("Error, el post no fue encontrado");
    err.status = 404;
    return next(err);
  }
  res.render("post_details", { post, comments });
});

module.exports.get_posts_list = asyncHandler(async (req, res, next) => {
  // Define the aggregation pipeline
  const posts = await Post.find().populate("numComments").populate("user");
  res.render("posts_list", { posts });
});

module.exports.delete_post = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `post deleted` });
  } catch (error) {
    res.status(400).json({ message: `Error when deleting post: ${error}` });
  }
};
