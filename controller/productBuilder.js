//import Builder from './builder';extends Builder
const Product = require('../models/products');

//CRUD
// C - Create
// R - Read
// U - Update
// D - Delete

//create new object in product table
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Product content can not be empty'
    });
  }
  //from model info
  const product = new Product({
    artikul: req.body.artikul,
    productName: req.body.productName,
    brand: req.body.brand,
    category: req.body.category,
    description: req.body.description,
    img_url: req.body.img_url,
    price: req.body.price,
    create_date: req.body.create_date
  });
  //save info
  product
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Something wrong while creating the product'
      });
    });
};

//read all elements for products model
exports.readAll = (req, res) => {
  Product.find()
    .then(products => {
      res.send(products);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Something wrong while retrieving products'
      });
    });
};
// read only one element for product model
exports.readOne = (res, req) => {
  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: 'Product not found with id ' + req.params.productId
        });
      }
      res.send(product);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: 'Product not found with id ' + req.params.productId
        });
      }
      return res.status(500).send({
        message:
          'Something wring retrieving product with id ' + req.params.productId
      });
    });
};

//update
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Product content can not be empty'
    });
  }
};

//delete only one element by id
exports.delete = (req, res) => {
  Product.findByIdAndRemove(req.params.productId)
    .then(product => {
      if (!product) {
        return res
          .status(404)
          .send({ message: 'Product not found by Id ' + req.params.productId });
      }

      res.send({ message: 'Deleted product successfully' });
    })
    .catch(err => {
      if (err.kind === 'ObjectId' || err.kind === 'NotFound') {
        return res.status(404).send({
          message: 'Product not found with id ' + req.params.productId
        });
      }
      return res.status(500).send({
        message: 'Could not delete product with id ' + req.params.productId
      });
    });
};
