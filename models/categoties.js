const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
  category_name: {
    type: String
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Categories = (module.exports = mongoose.model(
  'Categories',
  categoriesSchema
));

module.exports = Categories;
