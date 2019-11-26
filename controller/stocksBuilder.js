//extends

//THIS IS CRUD
// C - Create
// R - Read
// U - Update
// D - Delet
var async = require("async");

const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//import models
const Stock = require("../models/stocks");
const Product = require("../models/products");
//NEW VER.
exports.stock_list = function(req, res, next) {
  Stock.find()
    .sort([["quantity", "ascending"]])
    .exec(function(err, list_stocks) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("stock_list", {
        title: "Stock List",
        list_stocks: list_stocks
      });
    });
};

// Display detail page for a specific Stock.
exports.stock_detail = function(req, res, next) {
  async.parallel(
    {
      stock: function(callback) {
        Stock.findById(req.params.id).exec(callback);
      },

      stock_products: function(callback) {
        Product.find({ stock: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.stock == null) {
        // No results.
        var err = new Error("Stock not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("stock_detail", {
        title: "Stock Detail",
        stock: results.stock,
        stock_products: results.stock_products
      });
    }
  );
};

// Display Stock create form on GET.
exports.stock_create_get = function(req, res, next) {
  res.render("stock_form", { title: "Create Stock" });
};

// Handle Stock create on POST.
exports.stock_create_post = [
  // Validate that the name field is not empty.
  body("quantity")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Stock must be specified.")
    .isAlphanumeric()
    .withMessage("Stock has non-alphanumeric characters."),
  body("date", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601(),
  // Sanitize (escape) the name field.

  // Sanitize (trim) the name field.
  sanitizeBody("quantity").escape(),
  sanitizeBody("date").toDate(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a stock object with escaped and trimmed data.
    var stock = new Stock({ quantity: req.body.quantity });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("stock_form", {
        title: "Stock ",
        stock: stock,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Stock with same name already exists.
      Stock.findOne({ quantity: req.body.quantity }).exec(function(
        err,
        found_stock
      ) {
        if (err) {
          return next(err);
        }

        if (found_stock) {
          // Stock exists, redirect to its detail page.
          res.redirect(found_stock.url);
        } else {
          stock.save(function(err) {
            if (err) {
              return next(err);
            }
            // Stock saved. Redirect to stock detail page.
            res.redirect(stock.url);
          });
        }
      });
    }
  }
];

// Display Stock delete form on GET.
exports.stock_delete_get = function(req, res, next) {
  async.parallel(
    {
      stock: function(callback) {
        Stock.findById(req.params.id).exec(callback);
      },
      stock_products: function(callback) {
        Stock.find({ stock: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.stock == null) {
        // No results.
        res.redirect("/catalog/stock");
      }
      // Successful, so render.
      res.render("stock_delete", {
        title: "Delete Stock",
        stock: results.stock,
        stock_products: results.stock_products
      });
    }
  );
};

// Handle Stock delete on POST.
exports.stock_delete_post = function(req, res, next) {
  async.parallel(
    {
      stock: function(callback) {
        Stock.findById(req.params.id).exec(callback);
      },
      stock_products: function(callback) {
        Stock.find({ stock: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.stock_products.length > 0) {
        // Stock has products. Render in same way as for GET route.
        res.render("stock_delete", {
          title: "Delete Stock",
          stock: results.stock,
          stock_products: results.stock_products
        });
        return;
      } else {
        // Stock has no products. Delete object and redirect to the list of categories.
        Stock.findByIdAndRemove(req.body.id, function deletStock(err) {
          if (err) {
            return next(err);
          }
          // Success - go to categories list.
          res.redirect("/catalog/stocks");
        });
      }
    }
  );
};

// Display Stock update form on GET.
exports.stock_update_get = function(req, res, next) {
  Stock.findById(req.params.id, function(err, stock) {
    if (err) {
      return next(err);
    }
    if (stock == null) {
      // No results.
      var err = new Error("Stock not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("stock_form", {
      title: "Update Stock",
      stock: stock
    });
  });
};

// Handle Stock update on POST.
exports.stock_update_post = [
  // Validate that the name field is not empty.
  body("quantity")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Quantity must be specified.")
    .isAlphanumeric()
    .withMessage("Quantity has non-alphanumeric characters."),

  body("date", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601(),
  // Sanitize (escape) the name field.
  sanitizeBody("quantity").escape(),
  sanitizeBody("date").toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a stock object with escaped and trimmed data (and the old id!)
    var stock = new Stock({
      quantity: req.body.quantity,
      date: req.body.date,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("stock_form", {
        title: "Update Stock",
        stock: stock,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Stock.findByIdAndUpdate(req.params.id, stock, {}, function(
        err,
        thestock
      ) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to stock detail page.
        res.redirect(thestock.url);
      });
    }
  }
];
