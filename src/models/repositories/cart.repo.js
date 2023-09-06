'use strict'

const {cart} = require('../cart.model');
const {convertToObjectIdMongo} = require('../../utils')

const findCartIdById = async (cartId) => {
  return await cart.findOne({ 
    _id: convertToObjectIdMongo(cartId),
    cart_state: 'active'
  }).lean();
}

module.exports = {
  findCartIdById
}