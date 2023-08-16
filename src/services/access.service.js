'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const ShopModel = require('../models/shop.model');

const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const { BadRequestRequestError } = require('../core/error.response');

const RoleShop = {
	SHOP: 'SHOP',
	WRITER: 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN: 'ADMIN'
}

class AccessService {
	static signUp = async ({
		name,
		email,
		password
	}) => {
		try {
			// step1: check email
			const holderShop = await ShopModel.findOne({email}).lean();
			if(holderShop) {
				throw new BadRequestRequestError('Error: Shop already registered!');
			}

			const passwordHash = await bcrypt.hash(password, 10);
			const newShop = await ShopModel.create({
				email,
				name,
				password: passwordHash,
				roles: [RoleShop.SHOP]
			});
			if (newShop) {
				// created privateKey, publicKey
				// lv xxxx
				// const {
				// 	privateKey,
				// 	publicKey
				// } = crypto.generateKeyPairSync('rsa', {
				// 	modulusLength: 4096,
				// 	publicKeyEncoding: {
				// 		type:'pkcs1',
				// 		format: 'pem'
				// 	},
				// 	privateKeyEncoding: {
				// 		type:'pkcs1',
				// 		format: 'pem'
				// 	}
				// });
				const privateKey = crypto.randomBytes(64).toString('hex');
				const publicKey = crypto.randomBytes(64).toString('hex');

				const keyStore = await KeyTokenService.createKeyToken({
					userId: newShop._id,
					publicKey,
					privateKey
				});

				if(!keyStore) {
					return {
						code: 'xxxx',
						message: 'public key string error!' 
					}
				}

				const tokens = await createTokenPair({
					userId: newShop._id,
					email					
				}, publicKey, privateKey);

				return {
					code: 201,
					metadata: {
						shop: getInfoData({
							fields: ['_id', 'name'],
							object: newShop
						}),
						tokens
					}
				}
			}
			
			return {
				code: 200,
				metatdata: null
			}
		} catch (error) {
			return {
					code: 'xxx',
					message: error.message,
					status: 'error'
			}
		}
	}


}

module.exports = AccessService;