const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const customValidators = require("../utils/customValidators");
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
        res.redirect("/account/log_in");
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
    successRedirect: "/account/protected",
    failureRedirect: "/logged",
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
