const express = require("express");
const categoryRouter = express.Router();
const category_controller = require("../../controller/categoriesBuilder");

// CATEGORY ROUTS //

// GET request for creating category. NOTE This must come before route for id (i.e. display category).
categoryRouter.get("/category/create", category_controller.category_create_get);

// POST request for creating category.
categoryRouter.post(
  "/category/create",
  category_controller.category_create_post
);

// GET request to delete category.
categoryRouter.get(
  "/category/:id/delete",
  category_controller.category_delete_get
);

// POST request to delete category
categoryRouter.post(
  "/category/:id/delete",
  category_controller.category_delete_post
);

// GET request to update category.
categoryRouter.get(
  "/category/:id/update",
  category_controller.category_update_get
);

// POST request to update category.
categoryRouter.post(
  "/category/:id/update",
  category_controller.category_update_post
);

// GET request for one category.
categoryRouter.get("/category/:id", category_controller.category_detail);

// GET request for list of all category.
categoryRouter.get("/categories", category_controller.category_list);

module.exports = categoryRouter;
