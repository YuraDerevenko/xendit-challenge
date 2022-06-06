const logger = require("../../utils/logger");
const { ServerError } = require("../../errors");

class RideRequestHandler {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const { body } = req;
      const ride = await this.service.createRide(body);

      return res.send(ride);
    } catch (err) {
      this.errorHandler(err, req, res);
    }
  }

  async getAll(req, res) {
    try {
      const rides = await this.service.getRides();

      return res.send(rides);
    } catch (err) {
      this.errorHandler(err, req, res);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const ride = await this.service.getRideById(id);

      return res.send(ride);
    } catch (err) {
      this.errorHandler(err, req, res);
    }
  }

  async errorHandler(err, req, res) {
    logger.error(err);
    let {
      statusCode = ServerError.statusCode,
      message = ServerError.message,
      error_code = ServerError.error_code,
    } = err;

    return res.status(statusCode).send({ message, error_code });
  }
}

module.exports = RideRequestHandler;
