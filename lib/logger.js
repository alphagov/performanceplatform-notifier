var winston = require('winston'),
    config = require('../config'),
    loggingTransports = [],
    exceptionTransports = [],
    levels = {
      info: 0,
      request: 1,
      email: 2
    },
    colors = {
      request: 'blue',
      email: 'magenta'
    };

loggingTransports.push(
  new (winston.transports.File)({
    timestamp: true,
    filename: config.logFilePath
  })
);

exceptionTransports.push(
  new (winston.transports.File)({
    timestamp: true,
    filename: config.exceptionLogFilePath
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

var transports = {
  levels: levels,
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true
};

if (config.NODE_ENV === 'dev') {
  delete transports.exceptionHandlers;
}

var logger = new (winston.Logger)(transports);

winston.addColors(colors);

module.exports = logger;
