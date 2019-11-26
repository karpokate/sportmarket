//import Builder from './builder';extends Builder
const Category = require("../models/categories");
const Product = require("../models/products");
var async = require("async");

const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");

//CRUD
// C - Create
// R - Read
// U - Update
// D - Delete
//FROM MDN
// Display list of all Categories.
exports.category_list = function(req, res, next) {
  Category.find()
    .sort([["category_name", "ascending"]])
    .exec(function(err, list_categories) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("category_list", {
        title: "Category List",
        list_categories: list_categories
      });
    });
};

// Display detail page for a specific Category.
exports.category_detail = function(req, res, next) {
  async.parallel(
    {
      category: function(callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_products: function(callback) {
        Product.find({ category: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        var err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("category_detail", {
        title: "Category Detail",
        category: results.category,
        category_products: results.category_products
      });
    }
  );
};

// Display Category create form on GET.
exports.category_create_get = function(req, res, next) {
  res.render("category_form", { title: "Create Category" });
};

// Handle Category create on POST.
exports.category_create_post = [
  // Validate that the name field is not empty.
  body("category_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Category must be specified.")
    .isAlphanumeric()
    .withMessage("Category has non-alphanumeric characters."),

  // Sanitize (trim) the name field.
  sanitizeBody("category_name").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    var category = new Category({ category_name: req.body.categoru_name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      Category.findOne({ category_name: req.body.category_name }).exec(function(
        err,
        found_category
      ) {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save(function(err) {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to category detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  }
];

// Display Category delete form on GET.
exports.category_delete_get = function(req, res, next) {
  async.parallel(
    {
      category: function(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_products: function(callback) {
        Product.find({ category: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        res.redirect("/catalog/category");
      }
      // Successful, so render.
      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        category_products: results.category_products
      });
    }
  );
};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res, next) {
  async.parallel(
    {
      category: function(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_products: function(callback) {
        Product.find({ category: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.category_products.length > 0) {
        // Category has products. Render in same way as for GET route.
        res.render("category_delete", {
          title: "Delete Category",
          category: results.category,
          category_products: results.category_products
        });
        return;
      } else {
        // Category has no products. Delete object and redirect to the list of categories.
        Category.findByIdAndRemove(req.body.id, function deleteCategory(err) {
          if (err) {
            return next(err);
          }
          // Success - go to categories list.
          res.redirect("/catalog/categories");
        });
      }
    }
  );
};

// Display Category update form on GET.
exports.category_update_get = function(req, res, next) {
  Category.findById(req.params.id, function(err, category) {
    if (err) {
      return next(err);
    }
    if (category == null) {
      // No results.
      var err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("category_form", {
      title: "Update Category",
      category: category
    });
  });
};

// Handle Category update on POST.
exports.category_update_post = [
  // Validate that the name field is not empty.
  body("category_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Category must be specified.")
    .isAlphanumeric()
    .withMessage("Category has non-alphanumeric characters."),
  // Sanitize (escape) the name field.
  sanitizeBody("category_name").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data (and the old id!)
    var category = new Category({
      category_name: req.body.category_name,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Category.findByIdAndUpdate(req.params.id, category, {}, function(
        err,
        thecategory
      ) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to category detail page.
        res.redirect(thecategory.url);
      });
    }
  }
];

//END OF MDN
/*
//create categories (from db model)
exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Brand content can not be empty"
    });
  }
  const category = new Category({
    category_name: req.body.category_name || "Whithout category name",
    create_date: req.body.create_date
  });

  //save
  category
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

// read all
exports.readAll = (req, res) => {
  Category.find()
    .then((categories) => {
      res.send(categories);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something wrong while retrieving categories"
      });
    });
};

//read only one element by id
exports.readOne = (req, res) => {
  Category.findById(req.params.categoryId)
    .then((categories) => {
      if (!categories) {
        return res.status(404).send({
          message: "Category nnont found with id" + req.params.categoryId
        });
      }
      res.send(category);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Category not found with id" + req.params.categoryId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong retrieving category with id" + req.params.categoryId
      });
    });
};

//update
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Category content can not be empty"
    });
  }
};

///delete
exports.delete = (req, res) => {
  Categoty.findByIdAndRemove(req.params.categoryId)
    .then((category) => {
      if (!category) {
        return res.status(404).send({
          message: "Category  not found with id " + req.params.categoryId
        });
      }
      res.send({ message: "Deleted category successfully" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Categoty  not found with id" + req.params.categoryId
        });
      }
      return res.status(500).send({
        message: "Could not delete category with id" + req.params.categoryId
      });
    });
};*/
