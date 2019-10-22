const app = require('express');

//abstact class = interface
class Builder {
  get() {}
  put() {}
  post() {}
  delete() {}
}

module.exports = Builder;
