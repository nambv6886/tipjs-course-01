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
}

module.exports = new ProductController();