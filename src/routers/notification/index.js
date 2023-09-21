'use strict'

const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification.controller');

const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.use(authenticationV2);

router.get('', asyncHandler(notificationController.listNotiByUser));

module.exports = router;