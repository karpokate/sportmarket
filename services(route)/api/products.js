const express = require("express");
const productRouter = express.Router();

const products = require("../../controller/productBuilder");
productRouter.post("/", products.create);
productRouter.get("/", products.readAll);
productRouter.get("/:id", products.readOne);
productRouter.put("/", products.update);
productRouter.delete("/:id", products.delete);
module.exports = productRouter;
