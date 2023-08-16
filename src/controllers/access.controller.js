'use strict'

const AccessService = require("../services/access.service");

class AccessController {

	signup = async (req, res, next) => {
		console.log('[P]::signup::', req.body);
		return res.status(201).json(await AccessService.signUp(req.body))
	}

}

module.exports = new AccessController();