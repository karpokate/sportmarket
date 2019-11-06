const mongoose = require('mongoose');

const stocksSchema = mongoose.Schema({
  quantity: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  }
});

const Stocks = (module.exports = mongoose.model('Stocks', stocksSchema));

module.exports = Stocks;
