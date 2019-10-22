const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const Singleton = require('./config/db');
// parse requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// listen on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

// Load env vars
dotenv.config({ path: './config/config.env' });
// Connect to database
//connectDB();
singleton = new Singleton();

//make now code without patterns
//first test get with info
app.get('/', (req, res) => {
  res.send(
    'Please use /api/products or /api/categories or /api/brands or /api/stocks'
  );
});

//GET POST PUT DELETE FOR BRANDS

//GET POST PUT DELETE FOR CATEGORIES

//GET POST PUT DELETE FOR  STOCKS

//GET POST PUT DELETE FOR PRODUCTS

//HERE EXAMPLE https://github.com/bradtraversy/bookstore/blob/master/app.js
