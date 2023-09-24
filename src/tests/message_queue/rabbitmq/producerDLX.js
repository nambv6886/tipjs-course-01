
const amqp = require('amqplib')

// const message = 'a new product: title '

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost');

    const channel = await connection.createChannel();

    const notificationExchange = 'notificationEx'; // noti direct
    const notiQueue = 'notiQueueProcess'; // assertQueue
    const notificationExchangeDLX = 'notificationExDLX';
    const notiRoutingKeyDLX = 'notiRoutingKeyDLX'; // assert

    // 1. create exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true, // server -> restart -> old message still exists
    })

    // 2. create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phep cac ket noi khac truy cap vao cung 1 luc hang doi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notiRoutingKeyDLX
    });
    // 3. bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange); 

    // 4 send message
    const message = 'Send a noti'
    await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
      expiration: '10000'
    })


    setTimeout(() => {
      connection.close();
      process.exit();
    })
  } catch (error) {
    console.log('Error::', error)
  }
}

runProducer().then(rs => console.log(rs)).catch(err => console.log(err))