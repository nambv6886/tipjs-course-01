'use strict'

const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27015/shopDev';

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true});

    mongoose.connect(connectionString, {
      maxConnecting: 50
    }).then(_ => {
      console.log('Connect mongodb success');
    }).catch(err => console.log('Connect mongodb error'));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;