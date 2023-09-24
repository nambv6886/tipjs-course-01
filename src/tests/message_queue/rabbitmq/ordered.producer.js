'use strict'
const amqp= require('amqplib')

async function producerOrderedMessage() {
  const connection = await amqp.connect('amqp://guest:guest@localhost');
  const channel = await connection.createChannel();

  const queueName = 'ordered-queued-message';

  await channel.assertQueue(queueName, {
    durable: true
  })

  for (let index = 0; index < 10; index++) {
    const message = `ordered-queued-message:: ${index}`;
    console.log(message);
    
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true
    });
  }

  setTimeout(() => {
    connection.close();
  }, 1000)
}


producerOrderedMessage().then(rs => console.log(rs)).catch(err => console.log(err))