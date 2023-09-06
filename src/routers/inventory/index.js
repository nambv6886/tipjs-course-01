'use strict'

const express = require('express');
const router = express.Router();
const InventoryController = require('../../controllers/inventory.controller');

const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.use(authenticationV2);

router.post('', asyncHandler(InventoryController.addStockToInventory));
module.exports = router;