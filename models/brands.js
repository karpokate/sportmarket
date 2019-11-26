const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const brandsSchema = new Schema({
  brand: {
    type: String,
    require: true,
    max: 100
  },
  country_of_brand: {
    type: String
  }
});
// Virtual for this brand instance URL.
brandsSchema.virtual("url").get(function() {
  return "/catalog/brand/" + this._id;
});

//Export model.
const Brands = (module.exports = mongoose.model("Brands", brandsSchema));
module.exports = Brands;
