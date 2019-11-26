//for realisation crud
//get post put delete
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const brands = require("./brands");
const categories = require("./categories");
const stocks = require("./stocks");
const product = require("./products");
const server = require("../../server")
//use routes
class Facade {
  constructor() {
    app.get("/hi/", (req, res) => {
      res.json({
        message:
          "Hi,there. It is test."
      });
    });
    app.use("/api/brands", brands);
    app.use("/api/categories", categories);
    app.use("/api/stocks", stocks);
    app.use("/api/product", product);
  }
}
module.exports = Facade;
