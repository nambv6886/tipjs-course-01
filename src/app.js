require('dotenv').config();

const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ 
  extended: true
}))
// init db
require('./dbs/init.mongodb');
// const { checkOverLoad } = require('./helpers/check.connect');
// checkOverLoad();
// init routes
app.use('/', require('./routers'))
// handle error
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: err.stack,
    message: err.message || 'Internal Server Error'
  })
})

module.exports = app;