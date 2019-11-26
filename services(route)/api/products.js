const express = require("express");
const productRouter = express.Router();

// PRODUCT ROUTES //
const product_controller = require("../../controller/productBuilder");

// GET request for creating a Product. NOTE This must come before routes that display Product (uses id).
productRouter.get("/product/create", product_controller.product_create_get);

// POST request for creating Product.
productRouter.post("/product/create", product_controller.product_create_post);

// GET request to delete Product.
productRouter.get("/product/:id/delete", product_controller.product_delete_get);

// POST request to delete Product.
productRouter.post(
  "/product/:id/delete",
  product_controller.product_delete_post
);

// GET request to update Product.
productRouter.get("/product/:id/update", product_controller.product_update_get);

// POST request to update Product.
productRouter.post(
  "/product/:id/update",
  product_controller.product_update_post
);

// GET request for one Product.
productRouter.get("/product/:id", product_controller.product_detail);

// GET request for list of all Products.
productRouter.get("/products", product_controller.product_list);

module.exports = productRouter;
