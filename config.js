var config = require('./config.json');

config.NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = config;
