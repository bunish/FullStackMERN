const Category = require("../models/category.js");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    // cate = short from of catgegory
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save Category in DB",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Error!, No Categories found",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category; // see line 11
  category.name = req.body.name; // geeting from front-end

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Error!, Failed to Update Category",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Error!, Failed to Delete Category",
      });
    }
    res.json({
      message: `Successfully Deleted ${category.name} category!`,
    });
  });
};
