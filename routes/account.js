const express = require("express");

const router = express.Router();

const accountController = require("../controllers/accountController");

// GET Sign-in
// router.get("/sign-in", accountController.sign_in_get);

// // POST Sign-in
// router.post("/sign-in", accountController.sign_in_post);

// GET Sign-up
router.get("/sign-up", accountController.sign_up_get);

// POST Sign-up
router.post("/sign-up", accountController.sign_up_post);

// LogOut
// router.get("logout", accountController.logout);

module.exports = router;
