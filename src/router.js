const express = require("express");

const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/api-doc.json");

const ridesRouter = require("./features/rides/router");

module.exports = (db) => {
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  router.get("/health", (req, res) => res.send("Healthy"));

  router.use("/rides", ridesRouter(db));

  return router;
};
