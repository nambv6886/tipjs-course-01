'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const CheckoutServiceService = require("../services/checkout.service");

class CheckoutController {
  checkout = async (req,res,next) => {
    new SuccessResponse({
      message: 'Checkout success',
      metadata: await CheckoutServiceService.checkoutReview({
        ...req.body,
      })
    }).send(res)
  }
};

module.exports = new CheckoutController();