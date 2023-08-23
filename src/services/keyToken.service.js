'use strict'
const keyTokenModel = require('../models/keytoken.model');

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

}

module.exports = KeyTokenService;