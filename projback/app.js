require("dotenv").config(); // for "process.env" to hold secret values

const mongoose = require("mongoose"); // for handling mongo db
const express = require("express"); // express js
const app = express();
const bodyParser = require("body-parser"); // taking data from front-end
const cookieParser = require("cookie-parser"); // saving data in cookie of user's browser
const cors = require("cors");

// DEFINING MY ROUTES
const authRoutes = require("./routes/auth.js"); // signup,in,out - routes
const userRoutes = require("./routes/user.js"); // tshirt.com/user
const categoryRoutes = require("./routes/category.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");
const stripeRoutes = require("./routes/stripepayment.js");
const paymentBRoutes = require("./routes/paymentBRoutes.js");

// DB CONNECTION
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED SUCCESSFULLY");
  })
  .catch(() => {
    console.log("OOPS DATABASE NOT CONNECTED");
  });

// MIDDLEWARES
// "app.use" is used to integrate middleware
// IMP: these middlewares automatically applies to every "routes".
// IMP: if you want to apply to every route, put middleware at top
// because it applies to every route written below of this "app.use" code.
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// MY ROUTES

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", paymentBRoutes);

// USING PORT
const port = process.env.PORT || 8000;

// STARTING A SERVER
app.listen(port, () => {
  console.log(`App is connected at port ${port}`);
});
