import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./core/Home.js";
import Signup from "./user/Signup.js";
import Signin from "./user/Signin.js";
import AdminRoute from "./auth/helper/AdminRoutes.js";
import PrivateRoute from "./auth/helper/PrivateRoutes.js";
import UserDashboard from "./user/UserDashBoard.js";
import AdminDashboard from "./user/AdminDashBoard.js";
import AddCategory from "./admin/AddCategory.js";
import ManageCategories from "./admin/ManageCategories.js";
import AddProduct from "./admin/AddProduct.js";
import ManageProducts from "./admin/ManageProducts.js";
import UpdateProduct from "./admin/UpdateProduct.js";
import UpdateCategory from "./admin/UpdateCategory.js";
import Cart from "./core/Cart.js";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/cart" component={Cart} />
        <PrivateRoute exact path="/user/dashboard" component={UserDashboard} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute
          exact
          path="/admin/create/category"
          component={AddCategory}
        />
        <AdminRoute
          exact
          path="/admin/categories"
          component={ManageCategories}
        />
        <AdminRoute exact path="/admin/create/product" component={AddProduct} />
        <AdminRoute exact path="/admin/products" component={ManageProducts} />
        <AdminRoute
          exact
          path="/admin/product/update/:productId"
          component={UpdateProduct}
        />
        <AdminRoute
          exact
          path="/admin/category/update/:categoryId"
          component={UpdateCategory}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
