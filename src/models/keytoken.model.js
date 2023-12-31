'use strict'
const {Schema, model, Types} = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
  user:{
    type: Types.ObjectId,
    required:true,
    ref: 'Shop'
  },
  publicKey:{
    type: String,
    required:true,
  },
  privateKey:{
    type: String,
    required:true,
  },
  refreshTokenUsed:{
    type: Array,
    default: []
  },
  refreshToken:{
    required: true,
    type: String,
  },
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);