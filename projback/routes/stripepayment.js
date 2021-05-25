const express = require("express");
const router = express.Router();

const { makePayment } = require("../controllers/stripepayment.js");
const { isAuthenticated, isSignedIn } = require("../controllers/auth.js");
// TODO: isAuthenticated, isSignedIn

router.post("/stripepayment", makePayment);

module.exports = router;
