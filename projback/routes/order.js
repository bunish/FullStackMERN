const express = require("express");
const router = express.Router();

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js")
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user.js")
const {updateStock} = require("../controllers/product.js")

const {getOrderById, createOrder, getAllOrders, updateStatus, getOrderStatus} = require("../controllers/order.js");
const { route } = require("./auth.js");

// params 
router.param("userId", getUserById)
router.param("orderId", getOrderById)


// ACTUAL ROUTES
// create route
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

// read route
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)

// status of order
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus)
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus)


module.exports = router;