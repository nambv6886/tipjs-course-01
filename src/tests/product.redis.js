const RedisPubSubService = require('../services/redisPubsub.service');

class ProductServiceTest {
  async purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };
    await RedisPubSubService.init();
    RedisPubSubService.publish('purchase_events', JSON.stringify(order));
  }
}

module.exports = new ProductServiceTest();