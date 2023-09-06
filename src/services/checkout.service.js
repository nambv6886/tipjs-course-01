'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findCartIdById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service');
const order = require('../models/order.model');

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

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_order_ids
    });

    const products = shop_order_ids_new.flatMap(order => order.item_products);
    
    const acquireLock = [];
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const {productId, quantity} = product;
      const keyLock = await acquireLock({productId, cartId, quantity});
      acquireLock.push(keyLock ? true : false);

      if(keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireLock.includes(false)) {
      throw new BadRequestError('Mot so san phan da duoc cap nhat, vui long quay lai');
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    });

    if(newOrder) {
      // remove product in cart
    }

    return newOrder;
     
  }

  static async getOrdersByUser({

  }) {

  }
  static async cancelOrdersByUser({

  }) {
    
  }
  static async getOneOrderByUser({

  }) {
    
  }
  static async updateOrderStatusByShop({

  }) {
    
  }
}

module.exports = CheckoutService;