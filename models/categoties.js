const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const categoriesSchema = new Schema({
  category_name: {
    type: String,
    require: true,
    max: 100
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});
// Virtual for this categories instance URL.
categoriesSchema.virtual("url").get(function() {
  return "/catalog/category/" + this._id;
});
//Export model.
const Categories = (module.exports = mongoose.model(
  "Categories",
  categoriesSchema
));

module.exports = Categories;
