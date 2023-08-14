'use strict'

const ShopModel = require('../models/shop.model');
const bcrypt = require('brcypt');
const crypto = require('crypto');

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
				return {
					code: 'xxxx',
					message: 'Shop already registered!'
				}
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
				const {
					privateKey,
					publicKey
				} = crypto.generateKeyPairSync('rsa', {
					modulusLength: 4096
				});
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