import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";

import { signin, authenticate, isAuthenticated } from "../auth/helper";
// if it is index.js , no need to say, because it is default

const Signin = () => {
  const [values, SetValues] = useState({
    email: "b@bunish.com",
    password: "12345",
    error: "",
    loading: false,
    didRedirect: false,
  });

  const { email, password, error, loading, didRedirect } = values;
  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    // can write anything instead of name
    SetValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    SetValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          SetValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            SetValues({
              ...values,
              didRedirect: true,
            });
          });
        }
      })
      .catch((err) => {
        console.log("Sign in request failed, ", err);
      });
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }} // It means if error is true then show, if false display: none
            // default value of display in XML document is "inline"
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const SignInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                className="form-control"
                onChange={handleChange("email")}
                value={email}
                type="text"
              />
            </div>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                className="form-control"
                onChange={handleChange("password")}
                value={password}
                type="password"
              />
            </div>
            <button onClick={onSubmit} className="btn btn-primary btn-block">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base
      title="Sign In Page"
      description="A page where u can signin, Any time! :)"
    >
      {loadingMessage()}
      {errorMessage()}
      {SignInForm()}
      {performRedirect()}
      <p className="text-white text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default Signin;
