'use strict'
const amqp= require('amqplib');

async function summerOrderedMessage() {
  const connection = await amqp.connect('amqp://guest:guest@localhost');
  const channel = await connection.createChannel();

  const queueName = 'ordered-queued-message';

  await channel.assertQueue(queueName, {
    durable: true
  })

  // set prefetch to 1 to ensure only one message ack at a time
  channel.prefetch(1);

  channel.consume(queueName, msg => {
    const message = msg.connect.toString();

    setTimeout(() => {
      console.log('Process message::', message);
    }, Math.random() * 1000);



  })

}


summerOrderedMessage().then(rs => console.log(rs)).catch(err => console.log(err))