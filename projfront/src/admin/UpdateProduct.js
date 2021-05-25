import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import {
  getCategories,
  getAProduct,
  updateProduct,
} from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const UpdateProduct = ({ history, match }) => {
  // "match" is used to extract parameters from url in react
  const { user, token } = isAuthenticated();

  const [values, setvalues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getaRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getaRedirect,
    formData,
  } = values;

  const preLoad = (productId) => {
    getAProduct(productId).then((data) => {
      //   console.log(data);
      if (data.error) {
        setvalues({ ...values, error: data.error });
        // console.log(data.error);
      } else {
        preLoadCategories();
        setvalues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          stock: data.stock,
          formData: new FormData(),
        });
      }
    });
  };

  const preLoadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setvalues({ ...values, error: data.error });
      } else {
        setvalues({
          categories: data, // this will initialise categories
          formData: new FormData(), // this will put categories in form
        });
      }
    });
  };

  useEffect(() => {
    // "useEffect" is used to the stuff before the site loads i.e. preload
    preLoad(match.params.productId);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setvalues({ ...values, error: "", loading: true });
    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setvalues({ ...values, error: data.error });
        } else {
          setvalues({
            ...values,
            name: "",
            description: "",
            price: "",
            photo: "",
            stock: "",
            loading: false,
            createdProduct: data.name,
            getaRedirect: true,
          });
        }
      }
    );
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setvalues({ ...values, [name]: value, error: "" });
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: createdProduct ? "" : "none" }}
      >
        <h4>{createdProduct} Tshirt Updated successfully!</h4>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        className="alert alert-warning mt-3"
        style={{ display: error ? "" : "none" }}
      >
        <h4>
          {error} {createdProduct}
        </h4>
      </div>
    );
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

  const performRedirect = () => {
    if (getaRedirect) {
      setTimeout(() => {
        history.push("/admin/dashboard");
        // here we can't use Redirect because it is a component and cannot be rendered in callback dunction
      }, 3000);
    }
  };

  const createProductForm = () => (
    <form>
      <span>Select Photo: &nbsp; </span>
      <span className="alert-warning">
        Note: If your are not updating photo, no need to select photo again
      </span>
      <div className="form-group mt-2">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select Category</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Product
      </button>
    </form>
  );

  return (
    <Base
      title="Add Product"
      description="Product Creation section"
      className="container bg-info p-4"
    >
      <Link className="btn btn-md btn-success mb-3" to="/admin/dashboard">
        Go Back to Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {loadingMessage()}
          {successMessage()}
          {errorMessage()}
          {createProductForm()}
          {performRedirect()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateProduct;
