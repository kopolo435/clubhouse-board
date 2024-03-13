const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const verifyFunction = async function (username, password, done) {
  try {
    const user = await User.find({ username }).exec();
    if (!user) {
      return done(null, false);
    }
    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const strategy = new LocalStrategy(verifyFunction);
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId).exec();
    done(null, user);
  } catch (error) {
    done(error);
  }
});
