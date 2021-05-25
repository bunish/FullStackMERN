import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper/index";

const Signup = () => {
  const [values, SetValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, password, error, success } = values;

  const handleChange = (name) => (event) => {
    // can write anything instead of name
    SetValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    SetValues({ ...values, error: false });
    signup({ name, email, password })
      .then((data) => {
        if (data.error) {
          SetValues({ ...values, error: data.error, success: false });
        } else {
          SetValues({
            // after submitting, input fields will be blank
            ...values,
            email: "",
            password: "",
            error: "",
            success: true,
          });
        }
      })
      .catch(console.log("Error in SignUp"));
  };

  const SignUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Name</label>
              <input
                className="form-control"
                onChange={handleChange("name")}
                type="text"
                value={name}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                className="form-control"
                onChange={handleChange("email")}
                type="text"
                value={email}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                className="form-control"
                onChange={handleChange("password")}
                type="password"
                value={password}
              />
            </div>
            <button onClick={onSubmit} className="btn btn-primary btn-block">
              Submit
            </button>
            {/* we have not used parenthesis here i.e. onSubmit() because () are used 
          when we want a function to run immediately and In this case,
          we want a event to be completed, then onsubmit will work. (Just sumbit when something happens) */}
          </form>
        </div>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }} // It means if success is true then show, if false display: none
            // default value of display in XML document is "inline"
          >
            Congratulation, <strong>{name}</strong>! Your Account was created
            Successfully created. You Can <Link to="/signin">Login Here.</Link>
          </div>
        </div>
      </div>
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

  return (
    <Base
      title="Signup Page"
      description="A page where u can signup, only once! :)"
    >
      {successMessage()}
      {errorMessage()}
      {SignUpForm()}
      <p className="text-white text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default Signup;
