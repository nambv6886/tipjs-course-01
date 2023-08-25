'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');

const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.get('/search/:keySearch', asyncHandler(productController.searchAllPublishedsForUser));
router.get('', asyncHandler(productController.findAllProduct));
router.get('/:product_id', asyncHandler(productController.findProduct));

router.use(authenticationV2);

router.post('', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.publishProductByShop));

router.get('/drafts/all', asyncHandler(productController.findAllDraftsForShop));
router.get('/publisheds/all', asyncHandler(productController.findAllPublishedsForShop));

module.exports = router;