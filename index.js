/* eslint-disable no-global-assign */
require('dotenv').config();
require = require('@std/esm')(module);

module.exports = require('./app/server.mjs').default;
