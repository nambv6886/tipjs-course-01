'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findCartIdById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');

class CheckoutService {

  /**
   * {
   *    cartId,
   *    userId,
   *    shop_order_ids: [
   *      {
   *        shopId,
   *         shop_discount: [
   *            {
   *              "shopId",
   *              "discountId",
   *              "codeId"
   * '          }
   *         ],
   *        item_product: [
   *          {
   *            price,
   *            quantity,
   *            productId
   *          }
   *        ]
   *      }
   *   ]
   * }
   */
  static async checkoutReview({
    cartId, userId, shop_order_ids
  }) {
    // check carId is exists?
    const foundCart = await findCartIdById(cartId);
    if (!foundCart) throw new BadRequestError('Cart not found');

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0
    };
    const shop_order_ids_new = [];

    for (let index = 0; index < shop_order_ids.length; index++) {
      const shop = shop_order_ids[index];
      const { shopId, shop_discounts = [], item_products= []} = shop;

      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError('Order wrong');

      const checkoutPrice = checkProductServer.reduce((pre, curr) => {
        return pre + (curr.quantity * curr.price);
      }, 0);

      checkout_order.totalPrice +=checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products
      }

      if (shop_discounts.length > 0) {
        const { 
          discount = 0,
          totalPrice = 0
        } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        });

        checkout_order.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }
}

module.exports = CheckoutService;