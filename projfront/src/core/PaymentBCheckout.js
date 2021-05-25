import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { isAuthenticated } from "../auth/helper";
import { getMeToken, processPayment } from "./helper/paymentBhelper";
import { createOrder } from "./helper/orderHelper";
import DropIn from "braintree-web-drop-in-react";

const PaymentBCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null, // as mentioned in documentation of "braintree-web-drop-in-react"
    error: "",
    instance: {},
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getToken = (userId, token) => {
    getMeToken(userId, token).then((info) => {
      // console.log("INFORMATION ", info);
      if (info.error) {
        setInfo({ ...info, error: info.error });
        console.log("ERROR: ", info.error);
      } else {
        const clientToken = info.clientToken;
        setInfo({ clientToken }); // this is simply setInfo({clientToken: clientToken})
      }
    });
  };

  const showBTdropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button
              className="btn btn-block btn-info mt-3"
              onClick={onPurchase}
            >
              Pay with BrainTree Payment Gateway
            </button>
          </div>
        ) : (
          <h3>
            Either <Link to="/signin">SignIn</Link> or
            <Link to="/">Add Products</Link> to your cart.
          </h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token); // if we directly use getMeToken here, then it keeps on reloading fn , so we create one fn for this.
  }, []);

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce; // just a code codied from documentation of braintree
    let getNonce = info.instance
      .requestPaymentMethod() // copied from docs
      .then((data) => {
        nonce = data.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getAmount(),
        };
        processPayment(userId, token, paymentData)
          .then((response) => {
            setInfo({ ...info, success: response.success, loading: false });
            console.log("Payment Success");
            const orderData = {
              products: products,
              transaction_id: response.transaction.id, // this is from Braintree docs
              amount: response.transaction.amount, // this is from Braintree docs
            };
            createOrder(userId, token, orderData);
            cartEmpty(() => {
              console.log("YO YO HONEY SINGH");
            });
            setReload(!reload);
          })
          .catch((err) => {
            setInfo({ loading: false, success: false });
            console.log("Payment failed");
          });
      });
  };
  // card for testing
  // 3782 822463 10005
  // 12/21
  const getAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };
  return (
    <div className="mt-4">
      <h1>OR...</h1>
      <h3>Your Bill is {getAmount()} $</h3>
      {showBTdropIn()}
    </div>
  );
};
export default PaymentBCheckout;
