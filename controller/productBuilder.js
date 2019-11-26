//import all from models
var Product = require("../models/products");
var Category = require("../models/categories");
var Stock = require("../models/stocks");
var Brand = require("../models/brands");
//CRUD
// C - Create
// R - Read
// U - Update
// D - Delete

const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
var async = require("async");

// FROM MDN
// Display list of all products.
exports.product_list = function(req, res, next) {
  Product.find({}, "product_name category ")
    .populate("category")
    .exec(function(err, list_products) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("product_list", {
        title: "Product List",
        product_list: list_products
      });
    });
};

// Display detail page for a specific product.
exports.product_detail = function(req, res, next) {
  async.parallel(
    {
      product: function(callback) {
        Product.findById(req.params.id)
          .populate("category")
          .populate("brand")
          .exec(callback);
      },
      stock: function(callback) {
        Stock.find({ product: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        var err = new Error("Product not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("product_detail", {
        title: "Product name",
        product: results.product,
        stock: results.stock
      });
    }
  );
};

// Display product create form on GET.
exports.product_create_get = function(req, res, next) {
  // Get all categories and brands, which we can use for adding to our product.
  async.parallel(
    {
      categories: function(callback) {
        Category.find(callback);
      },
      brands: function(callback) {
        Brand.find(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      res.render("product_form", {
        title: "Create Product",
        categories: results.products,
        brands: results.brands
      });
    }
  );
};

// Handle product create on POST.
exports.product_create_post = [
  // Convert the brand to an array.
  (req, res, next) => {
    if (!(req.body.brand instanceof Array)) {
      if (typeof req.body.brand === "undefined") req.body.brand = [];
      else req.body.brand = new Array(req.body.brand);
    }
    next();
  },

  // Validate fields.
  body("artikul", "Artikul must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("productName", "Product name must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("brand", "Brand must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("category", "Category must not be empty")
    .isLength({ min: 1 })
    .trim(),
  body("description")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Description must be specified.")
    .isAlphanumeric()
    .withMessage("Description has non-alphanumeric characters."),
  body("image_url")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Image URL must be specified.")
    .isAlphanumeric()
    .withMessage("Image URL has non-alphanumeric characters."),
  body("price")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Price must be specified.")
    .isAlphanumeric()
    .withMessage("Price has non-alphanumeric characters."),
  body("stock", "Stock must not be empty.")
    .isLength({ min: 1 })
    .trim(),

  // Sanitize fields.
  sanitizeBody("*").escape(),
  sanitizeBody("brand.*").escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped and trimmed data.
    var product = new Product({
      artikul: req.body.artikul,
      productName: req.body.productName,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      image_url: req.body.image_url,
      price: req.body.price,
      stock: req.body.stock
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories and brands for form.
      async.parallel(
        {
          categories: function(callback) {
            Category.find(callback);
          },
          brands: function(callback) {
            Brand.find(callback);
          }
        },
        function(err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected brands as checked.
          for (let i = 0; i < results.brands.length; i++) {
            if (product.brand.indexOf(results.brands[i]._id) > -1) {
              results.brands[i].checked = "true";
            }
          }
          res.render("product_form", {
            title: "Create Product",
            categories: results.categories,
            brands: results.brands,
            product: product,
            errors: errors.array()
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save product.
      product.save(function(err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new product record.
        res.redirect(product.url);
      });
    }
  }
];

// Display product delete form on GET.
exports.product_delete_get = function(req, res, next) {
  async.parallel(
    {
      product: function(callback) {
        Product.findById(req.params.id)
          .populate("category")
          .populate("brand")
          .exec(callback);
      },
      product_stocks: function(callback) {
        Stock.find({ product: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        res.redirect("/catalog/products");
      }
      // Successful, so render.
      res.render("product_delete", {
        title: "Delete Product",
        product: results.product,
        stock: results.stock
      });
    }
  );
};

// Handle product delete on POST.
exports.product_delete_post = function(req, res, next) {
  // Assume the post has valid id (ie no validation/sanitization).

  async.parallel(
    {
      product: function(callback) {
        Product.findById(req.body.id)
          .populate("category")
          .populate("brand")
          .exec(callback);
      },
      product_stocks: function(callback) {
        Stock.find({ product: req.body.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.product_stocks.length > 0) {
        // Product has product_stocks. Render in same way as for GET route.
        res.render("product_delete", {
          title: "Delete Product",
          product: results.product,
          product_stocks: results.product_stocks
        });
        return;
      } else {
        // Product has no Stock objects. Delete object and redirect to the list of products.
        Product.findByIdAndRemove(req.body.id, function deleteProduct(err) {
          if (err) {
            return next(err);
          }
          // Success - got to products list.
          res.redirect("/catalog/products");
        });
      }
    }
  );
};

// Display product update form on GET.
exports.product_update_get = function(req, res, next) {
  // Get product, categoties and brands for form.
  async.parallel(
    {
      product: function(callback) {
        Product.findById(req.params.id)
          .populate("category")
          .populate("brand")
          .exec(callback);
      },
      categories: function(callback) {
        Category.find(callback);
      },
      brands: function(callback) {
        Brand.find(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        var err = new Error("Product not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected brands as checked.
      for (
        var all_b_iter = 0;
        all_b_iter < results.brands.length;
        all_b_iter++
      ) {
        for (
          var product_b_iter = 0;
          product_b_iter < results.product.brand.length;
          product_b_iter++
        ) {
          if (
            results.brands[all_b_iter]._id.toString() ==
            results.product.brand[product_b_iter]._id.toString()
          ) {
            results.brands[all_b_iter].checked = "true";
          }
        }
      }
      res.render("product_form", {
        title: "Update Product",
        categories: results.categories,
        brands: results.brands,
        product: results.product
      });
    }
  );
};

// Handle product update on POST.
exports.product_update_post = [
  // Convert the brand to an array.
  (req, res, next) => {
    if (!(req.body.brand instanceof Array)) {
      if (typeof req.body.brand === "undefined") req.body.brand = [];
      else req.body.brand = new Array(req.body.brand);
    }
    next();
  },

  // Validate fields.
  body("artikul", "Artikul must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("productName", "Product name must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("brand", "Brand must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("category", "Category must not be empty")
    .isLength({ min: 1 })
    .trim(),
  body("description")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Description must be specified.")
    .isAlphanumeric()
    .withMessage("Description has non-alphanumeric characters."),
  body("image_url")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Image URL must be specified.")
    .isAlphanumeric()
    .withMessage("Image URL has non-alphanumeric characters."),
  body("price")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Price must be specified.")
    .isAlphanumeric()
    .withMessage("Price has non-alphanumeric characters."),
  body("stock")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Stock must be specified.")
    .isAlphanumeric()
    .withMessage("Stock has non-alphanumeric characters."),

  // Sanitize fields.
  sanitizeBody("artikul").escape(),
  sanitizeBody("productName").escape(),
  sanitizeBody("category").escape(),
  sanitizeBody("description").escape(),
  sanitizeBody("image_url").escape(),
  sanitizeBody("price").escape(),
  sanitizeBody("stock").escape(),
  sanitizeBody("brand.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped/trimmed data and old id.
    var product = new Product({
      artikul: req.body.artikul,
      productName: req.body.productName,
      category: req.body.category,
      description: req.body.description,
      image_url: req.body.image_url,
      price: req.body.price,
      brand: typeof req.body.brand === "undefined" ? [] : req.body.brand,
      _id: req.params.id // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories and brands for form
      async.parallel(
        {
          categories: function(callback) {
            Category.find(callback);
          },
          brands: function(callback) {
            Brand.find(callback);
          }
        },
        function(err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected brands as checked.
          for (let i = 0; i < results.brands.length; i++) {
            if (product.brand.indexOf(results.brands[i]._id) > -1) {
              results.brands[i].checked = "true";
            }
          }
          res.render("product_form", {
            title: "Update Product",
            categories: results.categories,
            brands: results.brands,
            product: product,
            errors: errors.array()
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Update the record.
      Product.findByIdAndUpdate(req.params.id, product, {}, function(
        err,
        theproduct
      ) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to product detail page.
        res.redirect(theproduct.url);
      });
    }
  }
];

// END OF MDN
/*
//create new object in product table
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Product content can not be empty"
    });
  }
  //from model info
  const product = new Product({
    artikul: req.body.artikul,
    productName: req.body.productName,
    brand: req.body.brand,
    category: req.body.category,
    description: req.body.description,
    img_url: req.body.img_url,
    price: req.body.price,
    create_date: req.body.create_date
  });
  //save info
  product
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something wrong while creating the product"
      });
    });
};


//read all elements for products model
exports.readAll = (req, res) => {
  Product.find()
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something wrong while retrieving products"
      });
    });
};
// read only one element for product model
exports.readOne = (res, req) => {
  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).send({
          message: "Product not found with id " + req.params.productId
        });
      }
      res.send(product);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Product not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message:
          "Something wring retrieving product with id " + req.params.productId
      });
    });
};

//update
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Product content can not be empty"
    });
  }
};

//delete only one element by id
exports.delete = (req, res) => {
  Product.findByIdAndRemove(req.params.productId)
    .then((product) => {
      if (!product) {
        return res
          .status(404)
          .send({ message: "Product not found by Id " + req.params.productId });
      }

      res.send({ message: "Deleted product successfully" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.kind === "NotFound") {
        return res.status(404).send({
          message: "Product not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message: "Could not delete product with id " + req.params.productId
      });
    });
};*/
