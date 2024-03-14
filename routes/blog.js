const express = require("express");

const router = express.Router();
const postController = require("../controllers/postControllers");
const commentControler = require("../controllers/commentController");
const authMiddleware = require("./authMiddleware");

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

// GET show post details
router.get("/posts/:id", postController.show_post_details);

// POST create comment
router.post(
  "/comments/create",
  authMiddleware.isAuth,
  commentControler.create_comment
);

module.exports = router;
