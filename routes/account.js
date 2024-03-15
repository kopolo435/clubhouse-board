const express = require("express");

const router = express.Router();

const accountController = require("../controllers/accountController");
const authMiddleware = require("./authMiddleware");

// GET Sign-in
router.get("/sign-in", accountController.sign_in_get);

// // POST Sign-in
router.post("/sign-in", accountController.sign_in_post);

// GET Sign-up
router.get("/sign-up", accountController.sign_up_get);

// POST Sign-up
router.post("/sign-up", accountController.sign_up_post);

// GET add member page. Shows form to validate new member code
router.get(
  "/new-member",
  authMiddleware.isAuth,
  accountController.member_sign_up_get
);

// POST add member. Validates new member code and shows errors if invalidad
router.post(
  "/new-member",
  authMiddleware.isAuth,
  accountController.member_sign_up_post
);

// LogOut
router.get("/logout", accountController.logout);

// GET User details
router.get(
  "/profiles/:id",
  authMiddleware.isAuth,
  accountController.user_profile
);

module.exports = router;
