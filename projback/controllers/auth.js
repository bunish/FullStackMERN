const User = require("../models/user.js");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken"); // used to create token for user
var expressJwt = require("express-jwt");

const { use } = require("../routes/auth.js");
const user = require("../models/user.js");

exports.signup = (req, res) => {
  const errors = validationResult(req); // it gives the error coming from "check" used in auth-routes

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error:
        "problem in " + errors.array()[0].param + ", " + errors.array()[0].msg,
    });
  }

  // create new user
  const user = new User(req.body);

  // save in DB
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save file in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error:
        "problem in " + errors.array()[0].param + ", " + errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      // if some error or there is no user exist !
      return res.status(400).json({
        error: "User's Email does not exist",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    // CREATE TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // PUT TOKEN IN COOKIE
    res.cookie("token", token, { expire: new Date() + 9999 });

    // SEND RESPONSE TO FRONT END
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signout Successfully",
  });
};

// PROTECTED ROUTES  -- also a middleware

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth", // It returns _id of user
});

// CUSTOM MIDDLEWARE

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  // FIXME: CHECK ABOVE LINE
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "NOT ADMIN, ACCESS DENIED",
    });
  }
  next();
};
