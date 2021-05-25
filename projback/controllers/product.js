const Product = require("../models/product.js");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found in DB",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    // require 3 parameters --> err, fields, file
    if (err) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }

    // destructure the fields
    const { name, description, price, category, stock, photo } = fields;

    // restrictions   ( can also use express validator like is admin instead of this)
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please Include all fields",
      });
    }

    let product = new Product(fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product)

    // save to db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving Tshirt in DB failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    // means --> if photo has data, then return
    res.set("Content-type", req.product.photo.contentType);
    // optional (as browser automatically detects), but recommeneded to write

    return res.send(req.product.photo.data);
  }
};

// delete controller
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedProduct,
    });
  });
};

// update controller
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }

    // // destructure the fields
    // const {name ,description, price, category, stock, photo} = fields

    // // restrictions   ( can also use express validator like is admin instead of this)
    // if(
    //     !name ||
    //     !description ||
    //     !price ||
    //     !category ||
    //     !stock
    // ){
    //    res.status(400).json({
    //        error: "Please Include all fields"
    //    });
    // };

    // commented above because user do not want to update all things

    // updation code
    let product = req.product;
    product = _.extend(product, fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product)

    // save to db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of Tshirt in DB failed",
        });
      }
      res.json(product);
    });
  });
};

// products listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  // this means, use req.query (given by user), if not use default value 8
  // parseInt is used as user give value in string and to convert it into integer

  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  // we can use creation date, updation date, sold, id, etc
  // here no need to use parseInt, as string only is required here.

  Product.find()
    .select("-photo") // here (-) indicate that do not select photo as response get slow
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No products Found",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("categories", {}, (err, categort) => {
    if (err) {
      return res.status(400).json({
        error: "No Category Found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      // See Mongoose Documentation   Model.bulkWrite
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  // See Mongoose Documentation   Model.bulkWrite
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operations Failed!",
      });
    }
    next();
  });
};
