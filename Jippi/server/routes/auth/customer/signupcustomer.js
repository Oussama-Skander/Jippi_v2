const signupCustomerRouter = require("express").Router();
// const Customer = require("../../../database/");
const db = require("../../../../database/models");
const Customer = db.customers;
var passwordHash = require("password-hash");

signupCustomerRouter.post("/signup", (req, res) => {
  console.log("req.body", req.body);

  // Validate request
  if (!req.body.first_name) {
    res.status(400).send({
      message: "Name cannot be empty!",
    });
    return;
  }

  // Create a Customer

  const customer = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: passwordHash.generate(req.body.password),
    avatar: req.body.avatar,
    address: req.body.address,
    phone_number: req.body.phone_number,
  };

  // Save Customer in the database
  Customer.create(customer)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer.",
      });
    });
});

// signupCustomerRouter.post("/signup", async(req, res) => {
//   try {
//     const result = await Customer.create({});
//     res.send(result);
//   } catch (err) {
//     res.send(`signupCustomerRouter err ${err}`);
//   }
// });
module.exports = signupCustomerRouter;
