'use strict'
const _ = require('lodash');
const {Schema} = require('mongoose');

const getInfoData = ({ fields = [], object = {}}) => {
  return _.pick(object, fields)
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]));
}

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]));
}

const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] == null) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      removeUndefinedObject(obj[key]);
    }
  })

  return obj;
}

const updateNestedObjectParser = obj => {
  const final = {};
  Object.keys(obj).forEach(k => {
    if(typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const res = updateNestedObjectParser(obj[k]);
      Object.keys(res).forEach(a => {
        final[`${k}.${a}`] = res[a];
      })
    } else {
      final[k] = obj[k];
    }
  })
  return final;

}

const convertToObjectIdMongo = id => Schema.Types.ObjectId(id);

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongo
}