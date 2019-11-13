const express = require("express");
const categoryRouter = express.Router();
const categories = require("../../controller/categoriesBuilder");

categoryRouter.post("/", categories.create);
categoryRouter.get("/", categories.readAll);
categoryRouter.get("/:id", categories.readOne);
categoryRouter.put("/", categories.update);
categoryRouter.delete("/:id", categories.delete);
module.exports = categoryRouter;
