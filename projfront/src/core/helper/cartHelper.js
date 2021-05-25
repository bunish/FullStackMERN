export const addItemToCart = (item, next) => {
  // after this method, we will redirect user to cart page,
  // so if we require a callback fn, we have to use "next" keyword
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      // agar localstorage me kucch h to use "cart" array me daal do
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.push({
      // item i.e. product ko cart  me daal to
      ...item,
      count: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart)); // jo bhi cart me h vo local storage me daal do
    next();
  }
};

export const loadCart = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      // agar localstorage me kucch h to use "cart" array me daal do
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
};

export const removeItemFromCart = (productId) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.map((product, i) => {
      if (product._id === productId) {
        cart.splice(i, 1);
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart)); // update new cart
  }
  return cart; // maybe returning not necessary
};

export const cartEmpty = (next) => {
  if (typeof window !== undefined) {
    localStorage.removeItem("cart");
    let cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    // after empty cart we are storing a empty cart in localstorage, otherwise there is error or bug.
    // because server loosed access to "products" variable which is in cart
    next();
  }
};
