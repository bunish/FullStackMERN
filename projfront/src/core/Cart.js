import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import StripeCheckout from "./StripeCheckout";
import PaymentBCheckout from "./PaymentBCheckout";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);
  // we are just setting a method whose value changes from true to false and false to true
  // whenver remove to cart button is clicked,
  // so react thinks that some change is happening , so it reloads the page
  // if it seems tricky, we can also use history.push to reload. :)

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]); // this is such that whenever value of reload changes,
  //  setProducts(loadCart()); will be initiated again

  const loadAllProducts = () => {
    return (
      <div className="col-12">
        <h2 className="mb-3">
          Total {products.length} Product(s) in your Cart
        </h2>

        {products.map((product, index) => {
          return (
            <div className="col-6 float-left mb-2">
              <Card
                key={index}
                product={product}
                addtoCart={false}
                removeFromCart={true}
                setReload={setReload}
                reload={reload}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // const loadCheckout = () => {
  //   return (
  //     <div>
  //       <h2>Load CheckOut </h2>
  //     </div>
  //   );
  // };

  return (
    <Base title="Cart Page" description="Ready to CheckOut">
      <div className="row text-center">
        <div className="col-6">
          <div className="row">
            {products.length > 0 ? (
              loadAllProducts()
            ) : (
              <h3>No Products in Cart.</h3>
            )}
          </div>
        </div>
        <div className="col-6">
          <StripeCheckout products={products} setReload={setReload} />
          <PaymentBCheckout products={products} setReload={setReload} />
        </div>
      </div>
    </Base>
  );
};

export default Cart;
