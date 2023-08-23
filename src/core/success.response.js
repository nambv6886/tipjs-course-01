'use strict'

const StatusCode = {
  OK: 200,
  CREATED: 201,
}

const Reason = {
  CREATED: 'created',
  OK: 'Success'
}

class SuccessResponse {
  constructor({
    message, 
    statusCode = StatusCode.OK, 
    reasonStatusCode= Reason.OK,
    metadata= {}
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({message, metadata}) {
    super({message, metadata})
  }
}
class CREATED extends SuccessResponse {
  constructor({
    options = {},
    message,
     statusCode = StatusCode.CREATED,
     reasonStatusCode = Reason.CREATED,
      metadata}) {
    super({
      message,
       metadata,
       statusCode,
       reasonStatusCode
      })
      this.options = options
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse
}