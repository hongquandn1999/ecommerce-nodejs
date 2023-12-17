const express = require('express');
const app = express();
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
// import .env variables
require('dotenv').config();
// db
require('./db/init.mongodb');
const { countConnect } = require('./helpers/check.connect');
countConnect();
// middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
// routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

module.exports = app;
