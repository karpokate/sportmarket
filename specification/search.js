// by product name  == return item by name

//http get request with name
xports.readOne = (req, res) => {
  Category.findById(req.params.categoryId)
    .then(categories => {
      if (!categories) {
        return res.status(404).send({
          message: "Category nnont found with id" + req.params.categoryId
        });
      }
      res.send(category);
    })
    .catch(err => {
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

//rewrite
