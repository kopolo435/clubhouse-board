const express = require("express");

const router = express.Router();
const postController = require("../controllers/postControllers");
const authMiddleware = require("./authMiddleware");

// GET Create post
router.get(
  "/posts/create",
  authMiddleware.isAuth,
  postController.create_post_get
);

// POST create posty
router.post(
  "/posts/create",
  authMiddleware.isAuth,
  postController.create_post_post
);

module.exports = router;
