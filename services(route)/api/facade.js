//for realisation crud
//get post put delete
const express = require("express");
const app = express();

const brands = require("./brands");
const categories = require("./categories");
const stocks = require("./stocks");
const product = require("./products");
//use routes
class Facade {
  constructor() {
    app.use("/api/brands", brands);
    app.use("/api/categories", categories);
    app.use("/api/stocks", stocks);
    app.use("/api/product", product);
  }
}
module.exports = Facade;
