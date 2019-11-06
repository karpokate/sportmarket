//extends

//THIS IS CRUD
// C - Create
// R - Read
// U - Update
// D - Delet

//import model
const Stocks = require('../models/stocks');
//create
exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Stock info content can not be empty'
    });
  }
  const stock = new Stocks({
    quantity:
      req.body.quantity ||
      'No info about quantity. Try later. Now not avaluable',
    date: req.body.date,
    product: req.body.product
  });
  //save
  stock
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Something wrong while creating the stock info.'
      });
    });
};

// read all of stocks
exports.readAll = (req, res) => {
  Stocks.find()
    .then(stocks => {
      res.send(stocks);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Something wrong while retrieving stocks.'
      });
    });
};
// read only one by id stock
exports.readOne = (req, res) => {
  Stocks.findById(req.params.stockId)
    .then(stock => {
      if (!stock) {
        return res.status(404).send({
          message: 'Stock info not found with id' + req.params.stockId
        });
      }
      res.send(stock);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: 'Stock info not found with id' + req.params.stockId
        });
      }
      return res.status(500).send({
        message:
          'Something wrong retrieving stock info with id ' + req.params.stockId
      });
    });
};
//update whole db - info for this model
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: 'Stock  content can not be empty'
    });
  }
};
//delete stock info element by id
exports.delete = (req, res) => {
  Stocks.findByIdAndRemove(req.params.stockId)
    .then(stock => {
      if (!stock) {
        return res.status(404).send({
          message: 'Stock not found with id' + req.params.stockId
        });
      }
      res.send({ message: 'Stock info deleted successfully' });
    })
    .catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: 'Stock info not found with id' + req.params.stockId
        });
      }
      return res.status(500).send({
        message: 'Could not delet this stock info with id' + req.params.stockId
      });
    });
};
