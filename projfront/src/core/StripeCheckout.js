import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { isAuthenticated } from "../auth/helper";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  //
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const { user, token } = isAuthenticated();

  const getFinalPrice = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  // usually this is in helper file
  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        // we can call further method here like "createOrder", "clearCart", etc.
        cartEmpty(() => {
          console.log("YO YO HONEY SINGH");
        });
        setReload(!reload);
        const { status } = response;
        console.log("STATUS is", status);
      })
      .catch((err) => console.log(err));
  };

  const showStripeButton = () => {
    return isAuthenticated() && products.length > 0 ? (
      <StripeCheckoutButton
        stripeKey="pk_test_51H3ZxkJKZZr4pNnmYBjf9AyptDzHpw0r8whMQoQFcviAOo4ZQCTp74NjWpU0KLYo9vNKXT8GKTuzB1stBH8Ssgk400I4CUHSxH"
        token={makePayment}
        amount={getFinalPrice() * 100}
        name="Buy Tshirts"
        billingAddress
        shippingAddress
      >
        <button className="btn btn-success btn-lg">
          Pay with Stripe Payment Gateway
        </button>
      </StripeCheckoutButton>
    ) : (
      <h3>
        Either <Link to="/signin">SignIn</Link> or{" "}
        <Link to="/">Add Products</Link> to your cart.
      </h3>
    );
  };

  return (
    <div>
      <h3 className="text-white">
        Pay Rs. <strong>{getFinalPrice()}</strong>
      </h3>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
