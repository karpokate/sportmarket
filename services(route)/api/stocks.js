const express = require("express");
const stockRouter = express.Router();

const stocks = require("../../controller/stocksBuilder");
stockRouter.post("/stock/post", stocks.create);
stockRouter.get("/stock/getAll", stocks.readAll);
stockRouter.get("/stock/getOne", stocks.readOne);
stockRouter.put("/stock/put", stocks.update);
stockRouter.delete("/stock/delete", stocks.delete);
module.exports = stockRouter;
