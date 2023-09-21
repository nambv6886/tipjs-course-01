'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  listNotiByUser  = async (req,res,next) => {
    new SuccessResponse({
      message: 'Add to cart success',
      metadata: await NotificationService.listNotiByUser({
        ...req.body,
      })
    }).send(res)
  }

};

module.exports = new NotificationController();