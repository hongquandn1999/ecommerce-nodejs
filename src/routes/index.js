'use strict';
const express = require('express');
const { apiKey } = require('../auth/checkAuth');
const { checkPermission } = require('../services/apiKey.service');
const router = express.Router();
// check api key
router.use(apiKey);
router.use(checkPermission('0000'));
router.use('/v1/api', require('./access'));
router.use('/v1/api/product', require('./product'));

module.exports = router;
