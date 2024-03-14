const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const path = require("path");
const Post = require("../models/post");
const Comments = require("../models/comments");
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
