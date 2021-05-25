const stripe = require("stripe")(
  "sk_test_51H3ZxkJKZZr4pNnm0FBFGnW8YOmnAm20AYAu8C47ZxO5HasJrsmAyIICfiSmbsN3bgJTh5SHWFAqF1ZyhR8YuMSy00CxktRuGh"
);
const uuid = require("uuid/v4");

exports.makePayment = (req, res) => {
  const { products, token } = req.body;
  console.log("PRODUCTS", products);

  let amount = 0; // we can't use "const" here,
  // because amount will be change if more products are added to cart.
  products.map((p) => {
    amount = amount + p.price;
  });

  const idempotencyKey = uuid(); // it is compulsary as it will create unique id
  //, so that user will not get charged 2 times because of any error.

  // this is basic code of stripe, just read documentation of stripe

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "A Test Account",

            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.country,
                postal_code: token.card.address_zip,
              },
              //  can  get other things, see docs of stripe
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    });
};
