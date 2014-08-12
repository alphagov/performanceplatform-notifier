var winston = require('winston'),
    config = require('../config.json'),
    loggingTransports = [],
    exceptionTransports = [];

loggingTransports.push(
  new (winston.transports.File)({
    timestamp: true,
    filename: config.logFilePath
  })
);

exceptionTransports.push(
  new (winston.transports.File)({
    timestamp: true,
    filename: config.logFilePath
  })
);

if (process.env.NODE_ENV !== 'test') {
  loggingTransports.push(
    new (winston.transports.Console)({
      json: false,
      timestamp: true,
      colorize: true
    })
  );

  exceptionTransports.push(
    new (winston.transports.Console)({
      json: false,
      timestamp: true,
      colorize: true
    })
  );
}

var logger = new (winston.Logger)({
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true
});

module.exports = logger;
