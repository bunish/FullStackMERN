var express = require("express"); // express is used to create routes using http request
// http request are "post", "get", "put", "delete", etc.
var router = express.Router();
const { check, validationResult } = require("express-validator");
// check is used to check whether password is of min. 3 words, etc.
const {
  signout,
  signup,
  signin,
  isSignedIn,
} = require("../controllers/auth.js");

router.post(
  "/signup",
  [
    check("name", "name should be at least 3 characters").isLength({ min: 3 }),
    check("email", "email is not in correct form").isEmail(),
    check("password", "password should be at least 3 characters").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "correct form of email is required").isEmail(),
    check("password", "password is required").isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  res.send(req.auth);
});

module.exports = router;
