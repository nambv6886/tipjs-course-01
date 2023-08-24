'use strict'
const keyTokenModel = require('../models/keytoken.model');
const {Types: {ObjectId}} = require('mongoose');

class KeyTokenService {

  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken}) => {
    try {
      // lv 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })

      // return tokens ? tokens : null;

      // lv x
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = {
        upsert: true,
        new: true
      }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options).lean();
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static findByUserId = async (userId) => {
    const data = await keyTokenModel.findOne({ user: new ObjectId(userId) });

    return data;
  }

  static removeKeyById = (id) => {
    return keyTokenModel.deleteOne(id);
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return keyTokenModel.findOne({ refreshToken }).lean()
  }

  static updateOne = async (filter, update, options) => {
    return keyTokenModel.updateOne(filter, update, options)
  }

  static deleteKeyById = async (userId) => {
    return keyTokenModel.deleteOne({ user: new ObjectId(userId)}).lean()
  }

}

module.exports = KeyTokenService;