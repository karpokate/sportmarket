const express = require("express");
const brandRouter = express.Router();
const brands = require("../../controller/brandsBuilder");

brandRouter.post("/", brands.create);
brandRouter.get("/", brands.readAll);
brandRouter.get("/:id", brands.readOne);
brandRouter.put("/", brands.update);
brandRouter.delete(":id", brands.delete);

module.exports = brandRouter;
