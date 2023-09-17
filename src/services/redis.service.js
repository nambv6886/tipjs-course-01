'use strict'

const { promisify} = require('util');
const redis = require('redis');
const redisClient = redis.createClient();
// redisClient.connect()
// redisClient.ping((err, result) => {
//   if(err) {
//     console.log('Error connecting to Redis::', err);
//   } else {
//     console.log('Connected to Redis')
//   }
// })

const {reservationInventory} = require('../models/repositories/inventory.repo')

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let index = 0; index < retryTimes; index++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      // thao tao inventory
      const isRevervation = await reservationInventory({
        productId, quantity, cartId
      })
      if (isRevervation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50)); 
    }
  }
}

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
}

module.exports = {
  acquireLock,
  releaseLock
}