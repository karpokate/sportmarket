const express = require("express");
const categoryRouter = express.Router();
const categories = require("../../controller/categoriesBuilder");

module.exports = categoryRouter;
