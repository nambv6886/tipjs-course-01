const Redis = require('redis');

class RedisPubSubService {
  // constructor() {
  //   // this.subscriber = Redis.createClient();
  //   // this.publisher = Redis.createClient();
  //   return (async () => {
  //     this.subscriber = await Redis.createClient().connect();
  //     this.publisher = await Redis.createClient().connect();
  //     return this;
  //   })()
  //   // this.publisher.connect()
  // }
  async init() {
      this.subscriber = await Redis.createClient().connect();
      this.publisher = await Redis.createClient().connect();
  }

   publish(channel, message) {
  
    return new  Promise((resolve, reject) => {
     
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) reject (err)
        resolve(reply);
      })
    })
  }

  // sayHello() {
  //   console.log('hello')
  // }

  subscribe(channel, callback){
    // console.log('hello')
    // this.subscriber.subscribe(channel);
    this.subscriber.on('message', (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message)
      }
    })
  }

}

module.exports =  new RedisPubSubService();