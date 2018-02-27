'use strict'

require('dotenv').config();
require = require('@std/esm')(module);

let a = 10;
module.exports = require('./app/server.mjs').default;
