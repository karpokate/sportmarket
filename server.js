const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const Singleton = require("./config/db");
// parse requests
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// listen on port 3000
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

// Load env vars
dotenv.config({ path: "./config/config.env" });
// Connect to database
singleton = new Singleton();

//make now code without patterns
//first test get with info
app.get("/", (req, res) => {
  res.json({
    message:
      "Please use /api/products or /api/categories or /api/brands or /api/stocks"
  });
});

/*//connect routes
const brands = require("./services(route)/api/brands");
const categories = require("./services(route)/api/categories");
const stocks = require("./services(route)/api/stocks");
const product = require("./services(route)/api/products");

//use routes
app.use("/api/brands", brands);
app.use("/api/categories", categories);
app.use("/api/stocks", stocks);
app.use("/api/product", product);*/

const Facade = require("./services(route)/api/facade");
//connect to facade (REST)
facade = new Facade();
