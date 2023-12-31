'use strict'

const dev = {
	app: {
		port: process.env.DEV_APP_PORT || 3001
	},
	db: {
		uri:  process.env.DEV_DB_URI
	}
}

const pro = {
	app: {
		port: process.env.PRO_APP_PORT || 3001
	},
	db: {
		host: process.env.PRO_DB_HOST || 'localhost',
		port: process.env.PRO_DB_PORT || 27015,
		name: process.env.PRO_DB_NAME || 'shopDev',
	}
}

const config = {dev, pro};
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];