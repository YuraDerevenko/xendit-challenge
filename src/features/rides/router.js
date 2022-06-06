const express = require("express");

const router = express.Router();
const RidesRepo = require("./repository");
const RidesService = require("./service");
const RidesRequestHandler = require("./request-handlers");

const { wrap } = require("../../utils");

module.exports = (db) => {
  const repo = new RidesRepo(db);
  const service = new RidesService(repo);
  const handlers = new RidesRequestHandler(service);

  router.post("/", wrap(handlers.create.bind(handlers)));

  router.get("/", wrap(handlers.getAll.bind(handlers)));

  router.get("/:id", wrap(handlers.getById.bind(handlers)));

  return router;
};
