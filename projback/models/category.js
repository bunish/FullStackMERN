const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true, // if 2 category of same category name is generated, mongo-db will warn us.
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
