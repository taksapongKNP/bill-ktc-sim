const Positions = require("../services/services.positions");

// exports.create = async (req, res) => {
//   if (!req.body.product_name) {
//     res.status(400).send({
//       message: "product name can not be empty!",
//     });
//     return;
//   }

//   const products = {
//     product_name: req.body.product_name,
//     product_price: req.body.product_price ? req.body.product_price : 0,
//     product_status: req.body.product_status
//       ? req.body.product_status
//       : "Active",
//   };

//   Products.create(products)
//     .then((data) => res.send(data))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// };

exports.findAll = async (req, res) => {
  Positions.findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

// exports.findByProCode = (req, res) => {
//   const procode = req.params.procode;
//   Positions.findByProCode(procode)
//     .then((data) => res.send(data))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// };

// exports.findOne = (req, res) => {
//   const id = req.params.id;
//   Positions.findOne(id)
//     .then((data) => res.send(data))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// };

// exports.update = (req, res) => {
//   const id = req.params.id;
//   const data = req.body;
//   console.log(data);
//   Positions.update(id, data)
//     .then((data) => res.send(data))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// };

// exports.delete = (req, res) => {
//   const id = req.params.id;
//   Positions.delete(id)
//     .then((data) => res.send(data))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// };

// exports.deleteMultiRow = (req, res) => {
//   const data = req.body.data;
//   Positions.deleteMultiRow(data)
//     .then((data) => res.send(data))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// };
