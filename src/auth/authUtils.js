'use strict'
const jwt = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { 
  AuthFailureError,
  NotFoundError
} = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const HEADER = {
	API_KEY: 'x-api-key',
	AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    return {
      accessToken,
      refreshToken
    }
  } catch (error) {
    return error;
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1 - check userId missing
   * 2 - get access token
   * 3 - verify token
   * 4 - check user dbs
   * 5 - check key store with this userid
   * 6 - Ok -> return next
   */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid Userid');
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log('err:', error)
    throw error;
  }
})

module.exports = {
  createTokenPair,
  authentication
}