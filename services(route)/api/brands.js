const express = require("express");
const brandRouter = express.Router();
const brand_controller = require("../../controller/brandsBuilder");

// BRAND ROUTES //

// GET request for creating Brand. NOTE This must come before route for id (i.e. display brand).
brandRouter.get("/brand/create", brand_controller.brand_create_get);

// POST request for creating Brand.
brandRouter.post("/brand/create", brand_controller.brand_create_post);

// GET request to delete Brand.
brandRouter.get("/brand/:id/delete", brand_controller.brand_delete_get);

// POST request to delete Brand
brandRouter.post("/brand/:id/delete", brand_controller.brand_delete_post);

// GET request to update Brand.
brandRouter.get("/brand/:id/update", brand_controller.brand_update_get);

// POST request to update Brand.
brandRouter.post("/brand/:id/update", brand_controller.brand_update_post);

// GET request for one Brand.
brandRouter.get("/brand/:id", brand_controller.brand_detail);

// GET request for list of all Brands.
brandRouter.get("/brands", brand_controller.brand_list);

module.exports = brandRouter;
