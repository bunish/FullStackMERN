const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const ProductCartSchema = new mongoose.Schema({
  // about product in a cart
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

////////////////
//      CART SCHEMA
///////////////
const OrderSchema = new mongoose.Schema(
  {
    products: [ProductCartSchema], // refering to schema created above
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Recieved", // "enum" means admin can select and change status easily, only these values are accepeted
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, ProductCart };
//  we can export together as well as separate ... just 2 ways   :)
