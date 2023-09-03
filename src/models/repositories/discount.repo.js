'use strict'
const Discount = require('../discount.model')
const {
  getSelectData,
  getUnSelectData
} = require('../../utils');

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page=1,
  sort= 'ctime',
  filter,
  unSelect,
  model
}) => {
  const skip = (page -1) * limit;
  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
  const discounts = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  return discounts;
}

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page=1,
  sort= 'ctime',
  filter,
  unSelect,
  model
}) => {
  const skip = (page -1) * limit;
  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
  const discounts = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(unSelect))
    .lean();

  return discounts;
}

const checkDiscountExists = async ({
  model, filter
}) => {
  return await model.findOne(filter).lean();
}

module.exports = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists
}