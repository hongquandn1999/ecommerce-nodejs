const express = require('express');
const app = express();
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
// import .env variables
require('dotenv').config();
// db
require('./db/init.mongodb');
const { checkOverloadConnect } = require('./helpers/check.connect');
const e = require('express');
checkOverloadConnect();
// middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// routes
app.use('', require('./routes/index'));
// error handler
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  err.message = 'Invalid route';
  next(err);
});
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    status: 'error',
    code: err.status || 500,
    message: err.message || 'Internal Server Error',
  });
});
module.exports = app;
