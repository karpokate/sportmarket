//import Builder from './builder'; extends Builder

const Brand = require('../models/brands');

//CRUD
// C - Create
// R - Read
// U - Update
// D - Delete

//create brand element (from brand model)
exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'Brand content cannot be empty' });
  }
  //new object from model
  const brand = new Brand({
    brand: req.body.brand,
    country_of_brand: req.body.country_of_brand,
    create_date: req.body.create_date
  });
  //save (for create)
  brand
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Something wrong while creating the brand'
      });
    });
};

//read all elements from this brand table
exports.readAll = (req, res) => {
  Brand.find()
    .then(brands => {
      res.send(brands);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || ' Something wrong while retrieving brands'
      });
    });
};
//read only one element (by id)
exports.readOne = (req, res) => {
  Brand.findById(req.params.brandId)
    .then(brand => {
      if (!brand) {
        return res.status(404).send({
          message: 'Brand not found with id' + req.params.brandId
        });
      }
      res.send(brand);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: ' Brand not found with id' + req.params.brandId
        });
      }
      return res.status(500).send({
        message:
          ' Something wrong retrieving brand wirh id' + req.params.brandId
      });
    });
};
//update whole brand table
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Brand conntent can not be empty'
    });
  }
};
//delete only one element(by id)
exports.delete = (req, res) => {
  Brand.findByIdAndRemove(req.param.brandId)
    .then(brand => {
      if (!product) {
        return res.status(404).send({
          message: 'Brand cannot be found with id' + req.param.brandId
        });
      }
      res.send({ message: 'Brand element deleted successfully' });
    })
    .catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: 'Brand not found with id' + req.param.brandId
        });
      }
      return res.status(500).send({
        message:
          'Could not delete this brand element with id' + req.param.brandId
      });
    });
};
