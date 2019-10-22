const mongoose = require('mongoose');

const brandsSchema = mongoose.Schema({
  brand: {
    type: String
  },
  country_of_brand: {
    type: String
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Brands = (module.exports = mongoose.model('Brands', brandsSchema));

module.exports = Brands;
