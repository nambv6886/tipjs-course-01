'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const ShopModel = require('../models/shop.model');

const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const { BadRequestError, AuthFailureError, ForbidenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const { Types } = require('mongoose');

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
			// step1: check email
			const holderShop = await ShopModel.findOne({email}).lean();
			if(holderShop) {
				throw new BadRequestError('Error: Shop already registered!');
			}

			const passwordHash = await bcrypt.hash(password, 10);
			const newShop = await ShopModel.create({
				email,
				name,
				password: passwordHash,
				roles: [RoleShop.SHOP],
				status: 'active'
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

				const tokens = createTokenPair({
					userId: newShop._id,
					email					
				}, publicKey, privateKey);

				return {
					shop: getInfoData({
						fields: ['_id', 'name'],
						object: newShop
					}),
					tokens
				}
			}
			
			return {
				code: 200,
				metatdata: null
			}
	}

	/**
	 * 1 - check email in dbs
	 * 2 - match password 
	 * 3 - create AT vs RT and save
	 * 4 - generate token
	 * 5 - get data return login
	 * 
	 */
	static login = async ({email, password, refreshToken = null}) => {
		const foundShop = await findByEmail({email});
		if (!foundShop) {
			throw new BadRequestError('Shop not registered!')
		}

		const match = bcrypt.compare(password, foundShop.password);
		if (!match) throw new AuthFailureError('Authentiation Error');

		const privateKey = crypto.randomBytes(64).toString('hex');
		const publicKey = crypto.randomBytes(64).toString('hex');

		const tokens = createTokenPair({
			userId: foundShop._id,
			email					
		}, publicKey, privateKey);

		await KeyTokenService.createKeyToken({
			userId: foundShop._id,
			privateKey,
			publicKey,
			refreshToken: tokens.refreshToken,
		})
		return {
			shop: getInfoData({
				fields: ['_id', 'name'],
				object: foundShop
			}),
			tokens
		}
	}

	static logout = async (keyStore) => {
		return await KeyTokenService.removeKeyById(keyStore._id);
	}

	/**
	 * check this token used?
	 * 
	 */
	static handlerRefreshToken = async ({
		refreshToken,
		user,
		keyStore
	}) => {

		const {userId, email} = user;
		if (keyStore.refreshTokenUsed.includes(refreshToken)) {
			await KeyTokenService.deleteKeyById(userId); 
			throw new ForbidenError('Something wrong happened!! Pls relogin'); 
		}

		if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered');

		const foundShop = await findByEmail({email});
		if (!foundShop) throw new AuthFailureError('Shop not registered');

		const tokens = createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey);

		await KeyTokenService.updateOne({ user: new Types.ObjectId(userId) }, {
			$set: {
				refreshToken: tokens.refreshToken,
			},
			$addToSet: {
				refreshTokenUsed: refreshToken
			}
		});

		return {
			user,
			tokens
		}
	}
}

module.exports = AccessService;