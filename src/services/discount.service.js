'use strict'
const { convertToObjectIdMongo } = require('../utils');

const { BadRequestError } = require('../core/error.response');
const Discount = require('../models/discount.model');

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,start_date,end_date,is_active,
      shopId, min_order_value, product_ids,
      applies_to,name,description,type,value,
      max_uses, uses_count,max_uses_per_user,users_used
    } = payload;

    if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired!');
    }
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
}