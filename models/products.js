const mongoose = require('mongoose');

//close schema (table)
const productSchema = mongoose.Schema({
  artikul: {
    //smth like id
    type: String,
    require: true
  },
  productName: {
    type: String,
    require: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'brand',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categoties',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Product = (module.exports = mongoose.model('Product', productSchema));
module.exports = Product;
