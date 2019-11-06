//import Builder from './builder';extends Builder
const Category = require('../models/categoties');

//CRUD
// C - Create
// R - Read
// U - Update
// D - Delete

//create categories (from db model)
exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Brand content can not be empty'
    });
  }
  const category = new Category({
    category_name: req.body.category_name || 'Whithout category name',
    create_date: req.body.create_date
  });

  //save
  category
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Something wrong while creating the brand'
      });
    });
};

// read all
exports.readAll = (req, res) => {
  Category.find()
    .then(categories => {
      res.send(categories);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Something wrong while retrieving categories'
      });
    });
};

//read only one element by id
exports.readOne = (req, res) => {
  Category.findById(req.params.categoryId)
    .then(categories => {
      if (!categories) {
        return res.status(404).send({
          message: 'Category nnont found with id' + req.params.categoryId
        });
      }
      res.send(category);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: 'Category not found with id' + req.params.categoryId
        });
      }
      return res
        .status(500)
        .send({
          message:
            'Something wrong retrieving category with id' +
            req.params.categoryId
        });
    });
};

//update
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Category content can not be empty'
    });
  }
};

///delete
exports.delete = (req, res) => {
  Categoty.findByIdAndRemove(req.params.categoryId)
    .then(category => {
      if (!category) {
        return res.status(404).send({
          message: 'Category  not found with id ' + req.params.categoryId
        });
      }
      res.send({ message: 'Deleted category successfully' });
    })
    .catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: 'Categoty  not found with id' + req.params.categoryId
        });
      }
      return res.status(500).send({
        message: 'Could not delete category with id' + req.params.categoryId
      });
    });
};
