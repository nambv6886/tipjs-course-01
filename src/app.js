const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
// init db
// init routes
// handle error

module.exports = app;