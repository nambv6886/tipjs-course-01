'use strict'
const { convertToObjectIdMongo } = require('../utils');

const { BadRequestError, NotFoundError } = require('../core/error.response');
const Discount = require('../models/discount.model');
const { findAllProducts } = require('../models/repositories/product.repo');
const { 
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
 } = require('../models/repositories/discount.repo');
const discountModel = require('../models/discount.model');

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,start_date,end_date,is_active,
      shopId, min_order_value, product_ids,
      applies_to,name,description,type,value,
      max_uses, uses_count,max_uses_per_user,users_used
    } = payload;

    // if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError('Discount code has expired!');
    // }
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date');
    }

    // create index for discount code
    const foundDiscount = await Discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongo(shopId),
    }).lean();
    if(foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount is existed!');
    }

    const newDiscount = await Discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date:start_date,
      discount_end_date: end_date,
      discount_max_uses:max_uses,
      discount_uses_count:uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user:max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to:applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    });

    return newDiscount;
  }

  static async updateDiscountCode() {
    
  }

  static async getAllDiscountCodesWithProduct({
    code, shopId, userId, limit, page
  }) {

    const foundDiscount = await Discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongo(shopId),
    }).lean();
    if(!foundDiscount && !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists!')
    }

    const {
      discount_applies_to,
      discount_product_ids
    } = foundDiscount;
    let products;
    if (discount_applies_to === 'all') {
      // get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongo(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    if(discount_applies_to ==='specific') {
      // get product ids
      products = await findAllProducts({
        filter: {
          _id: {
            $in: discount_product_ids
          },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products;
  }

  static async getAllDiscountCodesByShop({
    limit, page, shopId
  }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongo(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discountModel
    });

    return discounts;
  }

  static async getDiscountAmount({
    codeId,
    userId,
    shopId,
    products
  }) {
    const foundDiscount = await checkDiscountExists({
      model: Discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongo(shopId),
      }
    })
    if(!foundDiscount) {
      throw new BadRequestError(`Discount doesn't existed!`);
    }

    const { 
      discount_is_active,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_value,
      discount_type
    } = foundDiscount;

    if(!discount_is_active) throw new BadRequestError(`Discount is expired!`);
    if(!discount_max_uses) throw new BadRequestError(`Discount is out`);

    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new BadRequestError(`Discount is expired!`); 
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((pre, cur) => {
        return pre + (cur.quantity * cur.price)
      }, 0);

      if (totalOrder < discount_min_order_value) throw new BadRequestError(`Discount requires a minimum order value of ${discount_min_order_value}`)
    }

    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find(user => user.userId === userId);
      if(userUseDiscount) throw new BadRequestError(`Discount is used`);
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }

  }

  static async deleteDiscountCode ({
    shopId,
    codeId
  }) {
    const deleted = await Discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongo(shopId)
    });

    return deleted;
  }

  
  static async cancelDiscountCode({
    codeId, shopId, userId
  }) {
    const foundDiscount = await checkDiscountExists({
      model: Discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongo(shopId)
      }
    });

    if(!foundDiscount) throw new NotFoundError('Discount does not exits');

    const result = await Discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    });

    return result;
  }
}

module.exports = DiscountService;