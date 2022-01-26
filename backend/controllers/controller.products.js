const Products = require("../services/services.products");

exports.create = async (req, res) => {
  
  if (!req.body.product_name) {
    res.status(400).send({
      message: "product name can not be empty!",
    });
    return;
  }

  const products = {
    product_name: req.body.product_name,
    product_price: req.body.product_price ? req.body.product_price : 0,
    product_num: req.body.product_num,
    product_status: req.body.product_status
      ? req.body.product_status
      : "Active",
  };

  console.log(`this data insert : ${products}`)

  Products.create(products)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findAll = async (req, res) => {
  Products.findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findByProCode = (req, res) => {
  const procode = req.params.procode;
  Products.findByProCode(procode)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Products.findOne(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(data)
  Products.update(id, data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Products.delete(id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.deleteMultiRow = (req, res) => {
  const data = req.body.data;
  Products.deleteMultiRow(data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.importProduct = (req, res) => {
  const data = req.body;
  Products.importProduct(data)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.fileAllproduct = (req, res) => {
  const surveycode = req.params.surveycode;
  // console.log("AAA"+surveycode)
  Products.fileAllproduct(surveycode)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
}
