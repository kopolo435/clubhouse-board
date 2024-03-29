const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("node:fs/promises");
require("dotenv").config();

const User = require("../models/user");
const Comment = require("../models/comment");
const Post = require("../models/post");
const customValidators = require("../utils/customValidators");
const upload = require("../utils/uploadImg");
// Sign up get request
module.exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign_up", { errors: {}, formValues: {} });
});

// Sing up post request, validates inputs and if valid save the new user
module.exports.sign_up_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debe introducir su nombre")
    .isAlpha("es-ES")
    .withMessage("Error, ingreso caracteres invalidos"),

  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debe introducir su apellido")
    .isAlpha("es-ES")
    .withMessage("Error, ingreso caracteres invalidos"),

  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debe introducir su nombre de usuario")
    .isAlphanumeric("en-US")
    .withMessage("Error, ingreso caracteres invalidos")
    .custom(customValidators.isUsernameInUse)
    .withMessage("Error, el nombre de usuario elegido ya se encuentra en uso"),

  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debe introducir un correo electronico")
    .isEmail()
    .withMessage("Error, debe introducir un correo electronico valido")
    .custom(customValidators.isEmailInUse)
    .withMessage("Error, el correo ya se encuentra en uso"),

  body("password")
    .isLength({ min: 8 })
    .escape()
    .withMessage("Error, la contraseña debe tener minimo 8 caracteres"),

  body("passwordConfirmation")
    .isLength({ min: 8 })
    .escape()
    .withMessage("Error, debe ingresar la contraseña nuevamente")
    .custom(customValidators.isPasswordEqual)
    .withMessage("Error, las constraseñas no coinciden"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const formValues = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    };

    if (!errors.isEmpty()) {
      res.render("sign_up", { errors: errors.mapped(), formValues });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          throw err;
        }
        const user = new User({
          first_name: formValues.first_name,
          last_name: formValues.last_name,
          username: formValues.username,
          email: formValues.email,
          password: hashedPassword,
        });

        await user.save();
        res.redirect("/account/sign-in");
      });
    }
  }),
];

module.exports.sign_in_get = asyncHandler(async (req, res, next) => {
  res.render("sign_in", { user: {}, errors: {} });
});

module.exports.sign_in_post = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe introducir su nombre de usuario")
    .isAlphanumeric("en-US")
    .withMessage("Error, ingreso caracteres invalidos"),

  body("password")
    .isLength({ min: 1 })
    .withMessage("Debe ingresar la contraseña"),
  function inputsValid(req, res, next) {
    const errors = validationResult(req);
    const user = { username: req.body.username, password: req.body.password };
    if (!errors.isEmpty()) {
      res.render("sign_in", { user, errors: errors.mapped() });
    } else {
      next();
    }
  },
  passport.authenticate("local", {
    successRedirect: "/blog/posts",
    failureRedirect: "/account/sign-in",
  }),
];

// GET add member page. Shows form to validate new member code
module.exports.member_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("new_member_form", { membercode: "", errors: {} });
});

// POST add member. Validates new member code and shows errors if invalidad
module.exports.member_sign_up_post = [
  body("membercode")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe introducir su codigo de membresia")
    .equals("12345678")
    .withMessage("El codigo ingresado no es valido"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("new_member_form", {
        errors: errors.mapped(),
        membercode: req.body.membercode,
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, { is_member: true });
      res.render("new_member_success");
    }
  }),
];

module.exports.logout = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports.user_profile = asyncHandler(async (req, res, next) => {
  const [user, posts, comments] = await Promise.all([
    User.findById(req.params.id).exec(),
    Post.find({ user: req.params.id })
      .populate("user")
      .sort({ date: -1 })
      .exec(),
    Comment.find({ user: req.params.id })
      .populate("user")
      .sort({ date: -1 })
      .exec(),
  ]);
  if (!user) {
    // No user with the id found
    const err = new Error("Usuario no encontrado");
    err.status = 404;
    return next(err);
  }

  res.render("user_profile", { user, posts, comments });
});

// Displays information of user found to update
module.exports.update_user_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  if (!user) {
    const err = new Error("Error, el usuario no fue encontrado");
    err.status = 404;
    return next(err);
  }

  res.render("update_user_form", { user, errors: {} });
});

// Recieves request to update information on the user
module.exports.update_user_post = [
  upload.single("img"),
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debe introducir su nombre")
    .isAlpha("es-ES")
    .withMessage("Error, ingreso caracteres invalidos"),

  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debe introducir su apellido")
    .isAlpha("es-ES")
    .withMessage("Error, ingreso caracteres invalidos"),

  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debe introducir su nombre de usuario")
    .isAlphanumeric("en-US")
    .withMessage("Error, ingreso caracteres invalidos")
    .custom(customValidators.isUpdatedUsernameInUse)
    .withMessage("Error, el nombre de usuario elegido ya se encuentra en uso"),

  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debe introducir un correo electronico")
    .isEmail()
    .withMessage("Error, debe introducir un correo electronico valido")
    .custom(customValidators.isUpdatedEmailInUse)
    .withMessage("Error, el correo ya se encuentra en uso"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const oldUser = await User.findById(req.params.id).exec();

    const user = new User({
      _id: req.params.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
    });
    if (req.file) {
      user.img_url = `/${path.relative("public", req.file.path)}`;
    } else {
      user.img_url = oldUser.img_url;
    }
    if (!errors.isEmpty()) {
      res.render("update_user_form", { user, errors: errors.mapped() });
    } else {
      await User.findByIdAndUpdate(req.params.id, user);
      if (
        req.file &&
        oldUser.img_url !== "/images/profiles/default-profile.jpg"
      ) {
        await fs.rm(`public/${oldUser.img_url}`);
      }
      res.redirect(user.url);
    }
  }),
];

// shows form to enter admin code
module.exports.set_admin_get = asyncHandler(async (req, res, next) => {
  res.render("admin_form", { adminCode: "", errors: {} });
});

// Validates admin code and if valid adds admin priviliges
module.exports.set_admin_post = [
  body("adminCode")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe introducir un codigo"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("admin_form", {
        adminCode: req.body.adminCode,
        errors: errors.mapped(),
      });
    } else if (req.body.adminCode === process.env.ADMIN_CODE) {
      const user = await User.findById(res.locals.currentUser.id).exec();
      user.is_admin = true;
      await user.save();
      res.redirect("/account/admin/dashboard");
    } else {
      res.render("admin_form", {
        adminCode: req.body.adminCode,
        errors: { adminCode: { msg: "El codigo ingresado es incorrecto" } },
      });
    }
  }),
];

// GET show admin dashboard
module.exports.admin_dashboard = asyncHandler(async (req, res, next) => {
  let posts;
  let comments;
  let { sortOrder } = req.query;
  // Checks if there is a sort filter for the comments
  if (req.query.sortOrder) {
    if (req.query.sortOrder === "recent") {
      // Sort posts and comments by date
      [posts, comments] = await Promise.all([
        Post.find()
          .sort({ date: -1 })
          .populate("numComments")
          .populate("user")
          .exec(),
        Comment.find().sort({ date: -1 }).populate("user").exec(),
      ]);
    } else if (req.query.sortOrder === "oldest") {
      // Sort posts and comments by date
      [posts, comments] = await Promise.all([
        Post.find()
          .sort({ date: 1 })
          .populate("numComments")
          .populate("user")
          .exec(),
        Comment.find().sort({ date: 1 }).populate("user").exec(),
      ]);
    } else if (req.query.sortOrder === "top") {
      // Sort posts and comments by points
      [posts, comments] = await Promise.all([
        Post.find()
          .sort({ points: -1 })
          .populate("numComments")
          .populate("user")
          .exec(),
        Comment.find().sort({ points: -1 }).populate("user").exec(),
      ]);
    } else if (req.query.sortOrder === "worst") {
      // Sort posts and comments by points
      [posts, comments] = await Promise.all([
        Post.find()
          .sort({ points: 1 })
          .populate("numComments")
          .populate("user")
          .exec(),
        Comment.find().sort({ points: 1 }).populate("user").exec(),
      ]);
    }
  } else {
    // Default sort order by descending date
    sortOrder = "recent";
    [posts, comments] = await Promise.all([
      Post.find()
        .sort({ date: -1 })
        .populate("numComments")
        .populate("user")
        .exec(),
      Comment.find().sort({ date: -1 }).populate("user").exec(),
    ]);
  }

  res.render("admin_dashboard", {
    comments,
    posts,
    sortOrder,
  });
});
