//import Builder from './builder'; extends Builder

const Brand = require("../models/brands");
var async = require("async");
const Product = require("../models/products");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");

//CRUD
// C - Create
// R - Read
// U - Update
// D - Delete

//FROM MDN
// Display list of all Brand.
exports.brand_list = function(req, res, next) {
  Brand.find()
    .sort([["brand", "ascending"]])
    .exec(function(err, list_brands) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("brand_list", {
        title: "Brand List",
        brand_list: list_brands
      });
    });
};

// Display detail page for a specific Brand.
exports.brand_detail = function(req, res, next) {
  async.parallel(
    {
      brand: function(callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brands_products: function(callback) {
        Product.find({ brand: req.params.id }, "title summary").exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      } // Error in API usage.
      if (results.brand == null) {
        // No results.
        var err = new Error("Brand not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("brand_detail", {
        title: "Brand Detail",
        brand: results.brand,
        brands_products: results.brands_products
      });
    }
  );
};

// Display Brand create form on GET.
exports.brand_create_get = function(req, res, next) {
  res.render("brand_form", { title: "Create Brand" });
};

// Handle Brand create on POST.
exports.brand_create_post = [
  // Validate fields.
  body("brand")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Brand must be specified.")
    .isAlphanumeric()
    .withMessage("Brand has non-alphanumeric characters."),
  body("country_of_brand")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Country of brand must be specified.")
    .isAlphanumeric()
    .withMessage("Country of has non-alphanumeric characters."),

  // Sanitize fields.
  sanitizeBody("brand").escape(),
  sanitizeBody("country_of_brand").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Brand object with escaped and trimmed data
    var brand = new Brand({
      brand: req.body.brand,
      country_of_brand: req.body.country_of_brand
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.

      // Save brand.
      brand.save(function(err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new brand record.
        res.redirect(brand.url);
      });
    }
  }
];

// Display Brand delete form on GET.
exports.brand_delete_get = function(req, res, next) {
  async.parallel(
    {
      brand: function(callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brands_products: function(callback) {
        Brand.find({ brand: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.brand == null) {
        // No results.
        res.redirect("/catalog/brands");
      }
      // Successful, so render.
      res.render("brand_delete", {
        title: "Delete Brand",
        brand: results.brand,
        brand_products: results.brands_products
      });
    }
  );
};

// Handle Brand delete on POST.
exports.brand_delete_post = function(req, res, next) {
  async.parallel(
    {
      brand: function(callback) {
        Brand.findById(req.body.brandId).exec(callback);
      },
      brands_products: function(callback) {
        Brand.find({ brand: req.body.brandId }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Success.
      if (results.brands_products.length > 0) {
        // Brand has products. Render in same way as for GET route.
        res.render("brand_delete", {
          title: "Delete Brand",
          brand: results.brand,
          brand_products: results.brands_products
        });
        return;
      } else {
        // Brand has no products. Delete object and redirect to the list of brands.
        Brand.findByIdAndRemove(req.body.brandId, function deleteBrand(err) {
          if (err) {
            return next(err);
          }
          // Success - go to brand list.
          res.redirect("/catalog/brands");
        });
      }
    }
  );
};

// Display Brand update form on GET.
exports.brand_update_get = function(req, res, next) {
  Brand.findById(req.params.id, function(err, brand) {
    if (err) {
      return next(err);
    }
    if (brand == null) {
      // No results.
      var err = new Error("Brand not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("brand_form", { title: "Update Brand", brand: brand });
  });
};

// Handle Brand update on POST.
exports.brand_update_post = [
  // Validate fields.
  body("brand")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Brand must be specified.")
    .isAlphanumeric()
    .withMessage("Brand has non-alphanumeric characters."),
  body("country_of_brand")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Country of brand must be specified.")
    .isAlphanumeric()
    .withMessage("Country of brand has non-alphanumeric characters."),

  // Sanitize fields.
  sanitizeBody("brand").escape(),
  sanitizeBody("country_of_brand").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Brand object with escaped and trimmed data (and the old id!)
    var brand = new Brand({
      brand: req.body.brand,
      country_of_brand: req.body.country_of_brand,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("brand_form", {
        title: "Update Brand",
        brand: brand,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Brand.findByIdAndUpdate(req.params.id, brand, {}, function(
        err,
        thebrand
      ) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to genre detail page.
        res.redirect(thebrand.url);
      });
    }
  }
];

//END OF MDN
/*
//create brand element (from brand model)
exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Brand content cannot be empty" });
  }
  //new object from model
  const brand = new Brand({
    brand: req.body.brand,
    country_of_brand: req.body.country_of_brand,
    create_date: req.body.create_date
  });
  //save (for create)
  brand
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something wrong while creating the brand"
      });
    });
};

//read all elements from this brand table
exports.readAll = (req, res) => {
  Brand.find()
    .then((brands) => {
      res.send(brands);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || " Something wrong while retrieving brands"
      });
    });
};
//read only one element (by id)
exports.readOne = (req, res) => {
  Brand.findById(req.params.brandId)
    .then((brand) => {
      if (!brand) {
        return res.status(404).send({
          message: "Brand not found with id" + req.params.brandId
        });
      }
      res.send(brand);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: " Brand not found with id" + req.params.brandId
        });
      }
      return res.status(500).send({
        message:
          " Something wrong retrieving brand wirh id" + req.params.brandId
      });
    });
};
//update whole brand table
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Brand conntent can not be empty"
    });
  }
};
//delete only one element(by id)
exports.delete = (req, res) => {
  Brand.findByIdAndRemove(req.param.brandId)
    .then((brand) => {
      if (!product) {
        return res.status(404).send({
          message: "Brand cannot be found with id" + req.param.brandId
        });
      }
      res.send({ message: "Brand element deleted successfully" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Brand not found with id" + req.param.brandId
        });
      }
      return res.status(500).send({
        message:
          "Could not delete this brand element with id" + req.param.brandId
      });
    });
};
*/
