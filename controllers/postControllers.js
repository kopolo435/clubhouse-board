const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const path = require("path");
const Post = require("../models/post");
const Like = require("../models/postLike");
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

// POST route for upvote post API
module.exports.upvote_post = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Start of transaction
      const [post, oldLike] = await Promise.all([
        Post.findById(req.body.postid).session(session).exec(),
        Like.findOne({ post: req.body.postid, user: req.user.id })
          .session(session)
          .exec(),
      ]);
      if (!post) {
        // Post to like not found
        const err = new Error("Error, no se econtro el post");
        throw err;
      }
      if (oldLike) {
        if (oldLike.is_positive_like) {
          // User wants to remove an upvote
          post.points -= 1;
          await Promise.all([post.save(), Like.findByIdAndDelete(oldLike.id)]);
          res.status(200).json({ message: "Upvote remove succesfully" });
          return Promise.resolve(true);
        }
        // User wants to change from downvote to upvote
        oldLike.is_positive_like = true;
        post.points += 2;
        await Promise.all([post.save(), oldLike.save()]);
        res.status(200).json({ message: `Post upvoted succesfully` });
        return Promise.resolve(true);
      }
      // first time like is an upvote
      post.points += 1;
      const like = new Like({
        post: req.body.postid,
        user: req.user.id,
        is_positive_like: true,
      });
      await Promise.all([post.save(), like.save()]);
      res.status(200).json({ message: `post upvoted succesfully` });
      return Promise.resolve(true);
    });
  } catch (error) {
    res.status(400).json({ message: `Error, trying to upvote post: ${error}` });
    await session.endSession();
  } finally {
    session.endSession(); // Always end the session after using it
  }
};

// POST route downvote post API
module.exports.downvote_post = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Start of transaction
      const [post, oldLike] = await Promise.all([
        Post.findById(req.body.postid).session(session).exec(),
        Like.findOne({ user: req.user.id, post: req.body.postid })
          .session(session)
          .exec(),
      ]);
      if (!post) {
        // Post to like not found
        const err = new Error("Error, no se econtro el post");
        throw err;
      }
      if (oldLike) {
        if (!oldLike.is_positive_like) {
          // User wants to remove downvote
          post.points += 1;
          await Promise.all([
            Like.findOneAndDelete({ _id: oldLike.id }),
            post.save(),
          ]);
          res.status(200).json({ message: "Downvote removed" });
          return Promise.resolve(true);
        }
        // User wants to change upvote to downvote
        post.points -= 2;
        oldLike.is_positive_like = false;
        await Promise.all([post.save(), oldLike.save()]);
        res.status(200).json({ message: "Post downvoted successfully" });
        return Promise.resolve(true);
      }
      // first time like is a downvote
      post.points -= 1;
      const like = new Like({
        post: req.body.postid,
        user: req.user.id,
        is_positive_like: false,
      });

      await Promise.all([post.save(), like.save()]);
      res.status(200).json({ message: `Post downvoted successfully` });
      return Promise.resolve(true);
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error, trying to downvote post: ${error}` });
  } finally {
    session.endSession();
  }
};
