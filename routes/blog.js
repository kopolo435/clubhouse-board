const express = require("express");

const router = express.Router();
const postController = require("../controllers/postControllers");
const commentControler = require("../controllers/commentController");
const authMiddleware = require("./authMiddleware");

// GET show list of all posts
router.get("/posts", postController.get_posts_list);

// GET Create post
router.get(
  "/posts/create",
  authMiddleware.isAuth,
  postController.create_post_get
);

// POST create post
router.post(
  "/posts/create",
  authMiddleware.isAuth,
  postController.create_post_post
);

// POST delete post
router.post(
  "/posts/:id/delete",
  authMiddleware.isAuth,
  authMiddleware.isAdmin,
  postController.delete_post
);

// GET show post details
router.get("/posts/:id", postController.show_post_details);

// POST upvote post
router.post(
  "/post/:id/upvote",
  authMiddleware.isAuth,
  postController.upvote_post
);

// POST downvote post
router.post(
  "/posts/:id/downvote",
  authMiddleware.isAuth,
  postController.downvote_post
);

// POST create comment
router.post(
  "/comments/create",
  authMiddleware.isAuth,
  commentControler.create_comment
);

// POST delete comment
router.post(
  "/comments/:id/delete",
  authMiddleware.isAuth,
  authMiddleware.isAdmin,
  commentControler.delete_comment
);

// POST upvote comment
router.post(
  "/comments/:id/upvote",
  authMiddleware.isAuth,
  commentControler.upvote_comment
);

// POST downvote comment
router.post(
  "/comments/:id/downvote",
  authMiddleware.isAuth,
  commentControler.downvote_comment
);

module.exports = router;
