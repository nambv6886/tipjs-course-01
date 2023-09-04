'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart  = async (req,res,next) => {
    new SuccessResponse({
      message: 'Add to cart success',
      metadata: await CartService.addToCart({
        ...req.body,
      })
    }).send(res)
  }

  updateCart  = async (req,res,next) => {
    new SuccessResponse({
      message: 'Add to cart success',
      metadata: await CartService.addToCartV2({
        ...req.body,
      })
    }).send(res)
  }

  deleteCart  = async (req,res,next) => {
    new SuccessResponse({
      message: 'Delete cart success',
      metadata: await CartService.deleteUserCart({
        ...req.body,
      })
    }).send(res)
  }

  listCart  = async (req,res,next) => {
    new SuccessResponse({
      message: 'List cart success',
      metadata: await CartService.getListUserCart({
        ...req.query,
      })
    }).send(res)
  }
};

module.exports = new CartController();