const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/category.js");
const {
  isAdmin,
  isAuthenticated,
  isSignedIn,
} = require("../controllers/auth.js");
const { getUserById } = require("../controllers/user.js");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// actual routes goes here --->

// create route
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// read route
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

// update route
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// delete route
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
