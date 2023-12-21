'use strict';

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const router = express.Router();

router.post('/signup', asyncHandler(AccessController.signup));

module.exports = router;
