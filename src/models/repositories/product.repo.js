'use strict'

const { Types } = require('mongoose');

const { 
  product,
  electronic,
  furniture,
  clothing
} = require('../../models/product.model');

const publishProductByShop = async ({ product_shop, product_id}) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })
  if (!foundProduct) return null;

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
}

const unPublishProductByShop = async ({ product_shop, product_id}) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })
  if (!foundProduct) return null;

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
}

const findAllDraftsForShop = async ({query, limit, skip}) => {
  return await queryProduct({query, limit, skip})
}

const findAllPublishedsForShop = async ({query, limit, skip}) => {
  return await queryProduct({query, limit, skip})
}

const searchProductByUser = async ({keySearch}) => {
  const regexSearch = new RegExp(keySearch);
  const result = await product.find({
    $text: {
      $search: regexSearch
    },
    isPublished: true,
  }, 
  {
    score: {
      $meta: 'textScore'
    }
  }).sort({
    score: {
      $meta: 'textScore'
    }
  }).lean();
  return result;
}

const queryProduct = async ({ query, limit, skip}) => {
  return await product.find(query)
  .populate({
    path:'product_shop',
    select: 'name email -_id'
  }).sort({ updateAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean()
}

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedsForShop,
  unPublishProductByShop,
  searchProductByUser
}
