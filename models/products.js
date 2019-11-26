const mongoose = require("mongoose");
var Schema = mongoose.Schema;
//close schema (table)
const productSchema = new Schema({
  productName: {
    type: String,
    require: true
  },
  artikul: {
    //smth like id
    type: String,
    require: true
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: "brand",
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
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
  stock: {
    type: Schema.Types.ObjectId,
    ref: "stocks",
    required: true
  }
});

// Virtual for this product instance URL.
productSchema.virtual("url").get(function() {
  return "/catalog/product/" + this._id;
});

//Exports model.
const Product = (module.exports = mongoose.model("Product", productSchema));
module.exports = Product;
