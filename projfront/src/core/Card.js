import React, { useState, useEffect } from "react";
import ImageHelper from "./helper/imageHelper";
import { addItemToCart, removeItemFromCart } from "./helper/cartHelper";
import { Redirect } from "react-router-dom";

const Card = ({
  product,
  addtoCart = true,
  removeFromCart = false,
  setReload = (f) => f, // just setting a function which does nothing ,
  // just take a value and return same value.   (used for reload when remove from cart is clicked)
  // setReload = function(f) = {  return  f  }
  reload = undefined,
}) => {
  //
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const cardTitle = product ? product.name : "Product Name";
  const cardDescription = product
    ? product.description
    : "Product Description goes here...";
  const cardPrice = product ? product.price : "XX";

  const addToCart = () => {
    addItemToCart(product, () => setRedirect(true)); // here a calback, bacause we have used next keyword
  };

  const getARedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCart = () => {
    return (
      addtoCart && (
        <button
          onClick={addToCart}
          className="btn btn-block btn-outline-primary mt-2 mb-2"
        >
          Add to Cart
        </button>
      )
    );
  };

  const showRemoveFromCart = () => {
    return (
      removeFromCart && (
        <button
          onClick={() => {
            removeItemFromCart(product._id);
            setReload(!reload); // just saying that change the value of reload from true to false
            // or false to true so that page can be reload

            //2nd way: easy: instead of setiing reload and setreload,
            // just write here "window.location.reload(true)"
          }}
          className="btn btn-block btn-outline-danger mt-2 mb-2"
        >
          Remove from cart
        </button>
      )
    );
  };

  return (
    <div className="card text-white bg-dark border border-info">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        {getARedirect(redirect)}
        <ImageHelper product={product} />
        <p className="lead bg-primary font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-primary rounded btn-md px-4">Rs. {cardPrice}</p>
        <div className="row">
          <div className="col-12">{showAddToCart()}</div>
          <div className="col-12">{showRemoveFromCart(removeFromCart)}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
