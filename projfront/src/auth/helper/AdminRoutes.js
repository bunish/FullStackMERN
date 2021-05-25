import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "."; // or './index.js'

// taken code and help from "reacttraining.com"  :)

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() && isAuthenticated().user.role === 1 ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location },
            }}
          />
        )
      }
      // This simply means if user has role 1 then allow him to go to component
      // otherwise send him to signIn Page
    />
  );
};

export default AdminRoute;
