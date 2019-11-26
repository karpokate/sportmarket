const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const stocksSchema = new Schema({
  quantity: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
// Virtual for this stock instance URL.
stocksSchema.virtual("url").get(function() {
  return "/catalog/stock/" + this._id;
});
//Export model.
const Stocks = (module.exports = mongoose.model("Stocks", stocksSchema));
module.exports = Stocks;
