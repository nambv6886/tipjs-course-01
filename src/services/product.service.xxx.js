'use strict'

const { BadRequestRequestError } = require('../core/error.response');
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedsForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById
} = require('../models/repositories/product.repo');

const {
  product,
  clothing,
  electronic,
  furniture
} = require('../models/product.model');
const { 
  removeUndefinedObject,
  updateNestedObjectParser
 } = require('../utils');

class ProductFactory {
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if(!productClass) throw new BadRequestRequestError('Invalid product type');

    return new productClass(payload).createProduct();
  }

  static async publishProductByShop ({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop ({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async updateProduct (type,productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if(!productClass) throw new BadRequestRequestError('Invalid product type');

    return new productClass(payload).updateProduct(productId);
  }

  static async findAllDraftsForShop ({ product_shop, limit = 50, skip = 0}) {
    const query = { product_shop, isDraft: true};
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static async findAllPublishedsForShop ({ product_shop, limit = 50, skip = 0}) {
    const query = { product_shop, isPublished: true};
    return await findAllPublishedsForShop({ query, limit, skip })
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProduct({
    limit= 50, 
    sort = 'ctime',
    page = 1, 
    filter = {isPublished: true},
    select = ['product_name', 'product_price', 'product_thumb']
  }) {
  return await findAllProducts({ 
    limit,
    sort,
    page,
    filter,
    select
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({
       product_id, 
       unSelect: [
        '__v',
      ] });
  }
}


class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({...this, _id: product_id});
  }

  async updateProduct(productId, payload) {
    return await updateProductById({
      productId,
      payload,
      model: product
    });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing =  await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestRequestError('Create new clothing error');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestRequestError('Create new product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    if(objectParams.product_attributes) {
      //update child
      await updateProductById({
        productId,
        payload: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing
      });
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic =  await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronic) throw new BadRequestRequestError('Create new electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestRequestError('Create new product error');

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture =  await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newFurniture) throw new BadRequestRequestError('Create new furniture error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestRequestError('Create new product error');

    return newProduct;
  }
}

ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;