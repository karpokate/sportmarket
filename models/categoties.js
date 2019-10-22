const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
  categoty_name: {
    type: String
  },
  create_data: {
    type: Date,
    default: Date.now
  }
});

const Categories = (module.exports = mongoose.model(
  'Categories',
  categoriesSchema
));

module.exports = Categories;
