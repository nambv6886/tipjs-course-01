'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
	createProduct = async (req, res, next) => {
    const {product_type} = req.body;
		new SuccessResponse({
			metadata: await ProductService.createProduct(product_type, req.body),
			message: 'create product success'
		}).send(res)
	}
}

module.exports = new ProductController();