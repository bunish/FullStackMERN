const express = require("express");
const router = express.Router();

const {getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product.js")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js")
const {getUserById} = require("../controllers/user.js")

// params
router.param("productId", getProductById)
router.param("userId", getUserById)

// actual routes

// create route
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)

// read route
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo);

// update route
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

// delete route 
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

// listing routes 
router.get("/products", getAllProducts)

// all unique categories
router.get("/products/categories", getAllUniqueCategories)

module.exports = router;
