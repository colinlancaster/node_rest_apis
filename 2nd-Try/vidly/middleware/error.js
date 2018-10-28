const winston = require('winston');

// This function catches any errors in the request processing pipeline.
module.exports = function(err, req, res, next) {
  // Log the exception
  winston.error(err.message, err);

  // Logging levels:
  //  Error
  //  Warn
  //  Info
  //  Verbose
  //  Debug
  //  Silly
  res.status(500).send('Something failed.');
}