'use strict'

const {
  notification
} = require('../models/notification.model')

const pushNotiToSystem = async ({
  type = 'SHOP-001',
  receivedId = 1,
  senderId = 1,
  options = {}
}) => {
  let noti_content;

  if (type === 'SHOP-001') {
    noti_content = `@ add new a product: @`;
  } else if (type === 'PROMOTION-001') {
    noti_content = `@ add new a voucher: @`;
  }

  const newNoti = await notification.create({
    noti_content,
    noti_options: options,
    noti_type: type,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
  });

  return newNoti;
}

const listNotiByUser = async ({
  userId= 1,
  type = 'ALL',
  isRead = 0
}) => {
  const match = {
    noti_receivedId: userId,
  };

  if (type !== 'ALL') {
    match['noti_type'] = type;
  }

  return await notification.aggregate([
    {
      $match: match
    }, {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: 1,
        createdAt: 1,
        noti_options: 1
      }
    }
  ])
}


module.exports = {
  pushNotiToSystem,
  listNotiByUser
}