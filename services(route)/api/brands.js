const express = require("express");
const brandRouter = express.Router();
const brands = require("../../controller/brandsBuilder");

brandRouter.post("/brand/post", brands.create);
brandRouter.get("/brand/getAll", brands.readAll);
brandRouter.get("/brand/getOne", brands.readOne);
brandRouter.put("/brand/put", brands.update);
brandRouter.delete("/brand/delete", brands.delete);

module.exports = brandRouter;
