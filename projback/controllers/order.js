const { Order, ProductCart } = require("../models/order.js");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")    // some confusion i.e products.product
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "NO order found in DB",
        });
      }
      req.order = order;
      next();
    });
};


exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);

    // save to db
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error: "Failed to save your order in DB"
            });
        }
        res.json(order)
    });
};

exports.getAllOrders = (req, res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "NO orders found in DB"
            });
        }
        res.json(order)
    });
};

exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("Status").enumValues);
};

exports.updateStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},      // can't we write only req.orderId
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err){
                res.status(400).json({
                    error: "Cannot Update Order Status"
                });
            }
            res.json(order);
        }
    );
};