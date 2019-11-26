const express = require("express");
const stockRouter = express.Router();

const stock_controller = require("../../controller/stocksBuilder");

// STOCK ROUTES ///

// GET request for creating a stock. NOTE This must come before route that displays BookInstance (uses id).
stockRouter.get("/stock/create", stock_controller.stock_create_get);

// POST request for creating stock.
stockRouter.post("/stock/create", stock_controller.stock_create_post);

// GET request to delete stock.
stockRouter.get("/stock/:id/delete", stock_controller.stock_delete_get);

// POST request to delete stock.
stockRouter.post("/stock/:id/delete", stock_controller.stock_delete_post);

// GET request to update stock.
stockRouter.get("/stock/:id/update", stock_controller.stock_update_get);

// POST request to update stock.
stockRouter.post("/stock/:id/update", stock_controller.stock_update_post);

// GET request for one stock.
stockRouter.get("/stock/:id", stock_controller.stock_detail);

// GET request for list of all stocks.
stockRouter.get("/stocks", stock_controller.stock_list);

module.exports = stockRouter;
