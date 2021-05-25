var braintree = require("braintree");

// code copied from https://developers.braintreepayments.com/start/hello-server/node
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "xby6chx28khfvr43",
  publicKey: "n4vbg3vnstpk2g4h",
  privateKey: "b8d0dd748797d1fa5dd1a3a47785d762",
});

// code copied from braintree
// here we cannot use .json as it is giving erroe
// so use .send as per documentation
exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    // var clientToken = response.clientToken
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;

  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.send(result);
      }
    }
  );
};
