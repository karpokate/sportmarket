const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const Singleton = require('./config/db');
// parse requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//it is just for test
const products = require('./controller/productBuilder');
const stocks = require('./controller/stocksBuilder');
const brands = require('./controller/brandsBuilder');
const categories = require('./controller/categoriesBuilder');
// listen on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
//for products
app.post('/product/post', products.create);
app.get('/product/getAll', products.readAll);
app.get('/product/getOne', products.readOne);
app.put('/product/put', products.update);
app.delete('/product/:id/delete', products.delete);

//for stocks
app.post('/stock/post', stocks.create);
app.get('/stock/getAll', stocks.readAll);
app.get('/stock/getOne', stocks.readOne);
app.put('/stock/put', stocks.update);
app.delete('/stock/delete', stocks.delete);
//for brands
app.post('/brand/post', brands.create);
app.get('/brand/getAll', brands.readAll);
app.get('/brand/getOne', brands.readOne);
app.put('/brand/put', brands.update);
app.delete('/brand/delete', brands.delete);
//for categories
//app.post('/category/', categories.);
//app.get();
//app.get();
///app.put();
//app.delete();

// Load env vars
dotenv.config({ path: './config/config.env' });
// Connect to database
//connectDB();
singleton = new Singleton();

//make now code without patterns
//first test get with info
app.get('/', (req, res) => {
  res.json({
    message:
      'Please use /api/products or /api/categories or /api/brands or /api/stocks'
  });
});

//GET POST PUT DELETE FOR BRANDS

//GET POST PUT DELETE FOR CATEGORIES

//GET POST PUT DELETE FOR  STOCKS

//GET POST PUT DELETE FOR PRODUCTS

//HERE EXAMPLE https://github.com/bradtraversy/bookstore/blob/master/app.js
module.exports = app;
