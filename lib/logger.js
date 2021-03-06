var winston = require('winston'),
    config = require('../config'),
    loggingTransports = [],
    exceptionTransports = [],
    levels = {
      info: 0,
      request: 1,
      email: 2,
      warn: 3,
      error: 4
    },
    colors = {
      info: 'green',
      request: 'blue',
      email: 'magenta',
      warn: 'yellow',
      error: 'red'
    };


if (config.NODE_ENV !== 'travis') {
  loggingTransports.push(
    new (winston.transports.File)({
      logstash: true,
      timestamp: true,
      filename: config.logFilePath
    })
  );

  exceptionTransports.push(
    new (winston.transports.File)({
      logstash: true,
      timestamp: true,
      filename: config.exceptionLogFilePath
    }),
    new (winston.transports.Console)({
      json: false,
      timestamp: true,
      colorize: true
    })
  );
}

loggingTransports.push(
  new (winston.transports.Console)({
    json: false,
    timestamp: true,
    colorize: true
  })
);

var transports = {
  levels: levels,
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true
};

if (config.NODE_ENV === 'dev' || config.NODE_ENV === 'travis') {
  delete transports.exceptionHandlers;
}

var logger = new (winston.Logger)(transports);

winston.addColors(colors);

module.exports = logger;
