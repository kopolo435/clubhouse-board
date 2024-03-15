function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ msg: "You are not authenticated to see this resource" });
  }
}

function isAdmin(req, res, next) {
  if (req.user.is_admin) {
    next();
  } else {
    res
      .status(401)
      .json({ msg: "You are not authenticated to see this resource" });
  }
}

function isMember(req, res, next) {
  if (req.user.is_member) {
    next();
  } else {
    res
      .status(401)
      .json({ msg: "You are not authenticated to see this resource" });
  }
}

module.exports.isAuth = isAuth;
module.exports.isAdmin = isAdmin;
module.exports.isMember = isMember;
