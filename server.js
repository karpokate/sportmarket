const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const Singleton = require('./config/db');
const mongoose = require('mongoose');
// parse requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// default route
//app.get('/', (req, res) => {
//  res.json({ message: 'Welcome to ZeptoBook Product app' });
//});

// listen on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

// Load env vars
dotenv.config({ path: './config/config.env' });
// Connect to database
//connectDB();
singleton = new Singleton();
