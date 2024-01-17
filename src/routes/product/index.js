'use strict';
const express = require('express');
const { authenticationV2 } = require('../../auth/authUtil');
const { asyncHandler } = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const router = express.Router();

// authen
router.use(authenticationV2);

// product
router.post('', asyncHandler(productController.createProduct));

module.exports = router;
