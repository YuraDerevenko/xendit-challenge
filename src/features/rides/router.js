const express = require("express");

const router = express.Router();
const RidesRepo = require("./repository");
const RidesService = require("./service");
const RidesRequestHandler = require("./request-handlers");

module.exports = (db) => {
  const repo = new RidesRepo(db);
  const service = new RidesService(repo);
  const handlers = new RidesRequestHandler(service);

  router.post("/", handlers.create.bind(handlers));

  router.get("/", handlers.getAll.bind(handlers));

  router.get("/:id", handlers.getById.bind(handlers));

  return router;
};
