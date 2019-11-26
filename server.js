var createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
//connect db
const Singleton = require("./config/db");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//help our server be optim. & savety

// listen on port 3000
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

// Load env vars
dotenv.config({ path: "./config/config.env" });
// Connect to database
singleton = new Singleton();

//connect routs (with facade)
const brandRouter = require("./services(route)/api/brands");
const categoryRouter = require("./services(route)/api/categories");
const stockRouter = require("./services(route)/api/stocks");
const productRouter = require("./services(route)/api/products");
const Facade = require("./services(route)/api/facade");
app.use("/", brandRouter);
app.use("/", categoryRouter);
app.use("/", stockRouter);
app.use("/", productRouter);
app.use("/catalog", Facade); // Add catalog routes to middleware chain.

//make now code without patterns
//first test get with info
app.get("/", (req, res) => {
  res.json({
    message:
      "Please use /api/product or /api/categories or /api/brands or /api/stocks"
  });
});

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});
