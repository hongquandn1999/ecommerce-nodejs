'use strict';

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtil');
const router = express.Router();

router.post('/signup', asyncHandler(AccessController.signup));
router.post('/login', asyncHandler(AccessController.login));

// authen
router.use(authentication);
router.post('/logout', asyncHandler(AccessController.logout));
router.post(
  '/refresh-token',
  asyncHandler(AccessController.handleRefreshToken)
);

module.exports = router;
