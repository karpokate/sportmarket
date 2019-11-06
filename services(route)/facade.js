//for realisation crud
//get post put delete
module.exports = app => {
  const products = require('../controller/productBuilder');

  app.post('./products', products.create);
  app.get('./products', products.readAll);
  app.get('./products', products.readOne);
  app.put('./products', products.update);
  app.delete('./products', products.delete);
};
