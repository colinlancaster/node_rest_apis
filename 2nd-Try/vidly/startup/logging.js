const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  // This method only deals with uncaughtExceptions. They have a GitHub issue open.
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true}),
    new winston.transports.File({  filename: 'uncaughtExceptions.log'}));

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, {filename: 'logfile.log'});
  winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/vidly',
    level: 'info'
  });


}