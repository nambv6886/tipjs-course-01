'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceXXX = require("../services/product.service.xxx");

class ProductController {
	createProduct = async (req, res, next) => {
    const {product_type} = req.body;
		new SuccessResponse({
			metadata: await ProductServiceXXX.createProduct(
				product_type,
				{
					...req.body,
					product_shop: req.user.userId
				}
			),
			message: 'create product success'
		}).send(res)
	}

	publishProductByShop = async (req, res, next) => {
		new SuccessResponse({
			metadata: await ProductServiceXXX.publishProductByShop({
				product_shop: req.user.userId,
				product_id: req.params.id
			}),
			message: 'Published product success'
		}).send(res)
	}
	unPublishProductByShop = async (req, res, next) => {
		new SuccessResponse({
			metadata: await ProductServiceXXX.unPublishProductByShop({
				product_shop: req.user.userId,
				product_id: req.params.id
			}),
			message: 'unPublished product success'
		}).send(res)
	}


	/**
	 * Get all drafts for shop
	 * @param {Number} limit 
	 * @param {Number} skip 
	 * @return {JSON}
	 */
	findAllDraftsForShop = async (req, res, next) => {
		new SuccessResponse({
			metadata: await ProductServiceXXX.findAllDraftsForShop({
				product_shop: req.user.userId
			}),
			message: 'Get list draft success'
		}).send(res)
	}

	findAllPublishedsForShop = async (req, res, next) => {
		new SuccessResponse({
			metadata: await ProductServiceXXX.findAllPublishedsForShop({
				product_shop: req.user.userId
			}),
			message: 'Get list published success'
		}).send(res)
	}

	searchAllPublishedsForUser = async (req, res, next) => {
		new SuccessResponse({
			metadata: await ProductServiceXXX.searchProducts(req.params),
			message: 'Search all published success'
		}).send(res)
	}

	findAllProduct = async (req, res, next) => {
		new SuccessResponse({
			metadata: await ProductServiceXXX.findAllProduct(req.query),
			message: 'Find all success'
		}).send(res)
	}

	findProduct = async (req, res, next) => {
		new SuccessResponse({
			metadata: await ProductServiceXXX.findProduct({
				product_id: req.params.product_id
			}),
			message: 'Find product success'
		}).send(res)
	}
}

module.exports = new ProductController();