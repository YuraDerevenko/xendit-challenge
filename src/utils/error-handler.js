const logger = require("./logger");
const { ServerError } = require("../errors");

module.exports = (err, req, res) => {
  logger.error(err);
  let {
    statusCode = ServerError.statusCode,
    message = ServerError.message,
    error_code = ServerError.error_code,
  } = err;

  return res.status(statusCode).send({ message, error_code });
};
