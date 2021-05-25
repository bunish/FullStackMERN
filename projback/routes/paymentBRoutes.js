const express = require("express");
const router = express.Router();

const { processPayment, getToken } = require("../controllers/paymentB.js");
const { isAuthenticated, isSignedIn } = require("../controllers/auth.js");
const { getUserById } = require("../controllers/user.js");

// params
router.param("userId", getUserById);

// get token for user for payment
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

// finally processing Payment... :)
router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;
