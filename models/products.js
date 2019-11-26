const mongoose = require("mongoose");
var Schema = mongoose.Schema;
//close schema (table)
const productSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: "brand"
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categoties",
    required: true
  },
  description: {
    type: String,
    max: 256
  },
  image_url: {
    type: String
  },
  price: {
    type: String,
    require: true,
    max: 100
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

// Virtual for this product instance URL.
productSchema.virtual("url").get(function() {
  return "/catalog/product/" + this._id;
});

//Exports model.
const Product = (module.exports = mongoose.model("Product", productSchema));
module.exports = Product;
