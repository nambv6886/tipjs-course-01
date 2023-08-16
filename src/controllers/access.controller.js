'use strict'

const { CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {

	signup = async (req, res, next) => {
		new CREATED({
			message: 'Registered OK',
			metadata: await AccessService.signUp(req.body)
		}).send(res)
	}

}

module.exports = new AccessController();