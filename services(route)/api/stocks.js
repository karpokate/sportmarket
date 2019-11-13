const express = require("express");
const stockRouter = express.Router();

const stocks = require("../../controller/stocksBuilder");
stockRouter.post("/", stocks.create);
stockRouter.get("/", stocks.readAll);
stockRouter.get("/:id", stocks.readOne);
stockRouter.put("/", stocks.update);
stockRouter.delete("/:id", stocks.delete);
module.exports = stockRouter;
