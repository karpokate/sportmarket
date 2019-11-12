const express = require("express");
const productRouter = express.Router();

const products = require("../../controller/productBuilder");

productRouter.post("/product/post", products.create);
productRouter.get("/product/getAll", products.readAll);
productRouter.get("/product/getOne", products.readOne);
productRouter.put("/product/put", products.update);
productRouter.delete("/product/:id/delete", products.delete);
module.export = productRouter;
