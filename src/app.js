"use strict";

const express = require("express");
const helmet = require("helmet");
const app = express();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const router = require("./router");
module.exports = (db) => {
  app.use(jsonParser);
  app.use(helmet());
  app.use(router(db));

  return app;
};
