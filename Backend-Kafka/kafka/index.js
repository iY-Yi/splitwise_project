const { Kafka, logLevel } = require('kafkajs');
const crypto = require('crypto');
const chalk = require('chalk');

const allTopics = {
  API_CALL: 'api-call',
  API_RESP: 'api-resp',
};

// Example usage
// (async () => {
// const k = await kafka();
// k.subscribe(allTopics.API_CALL, console.log);
// k.send(allTopics.API_CALL, {message:'m1'});
// const s = await k.callAndWait('sum', 1, 2);
// })();

const k = new Kafka({
  logLevel: logLevel.INFO,
  clientId: 'splitwise',
  brokers: process.env.KAFKA_BROKERS.split(','),
});

async function kafka() {
  const producer = k.producer();
  const groupId = process.env.GROUP;
  // App wide consumer group
  const consumer = k.consumer({ groupId, fromBeginning: false });
  // Topics need to be defined before staring the server
  const topics = Object.values(allTopics);
  const subscriptions = {};
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'api-call' });
  // await Promise.all(topics.map((topic) => consumer.subscribe({ topic })));

  const send = async (topic, msg) => {
    const messages = [{ value: JSON.stringify(msg) }];
    console.log(`Sending messages to topic ${topic}`, messages);
    producer.send({ topic, messages });
  };

  const subscribe = (topic, callback, name = null) => {
    if (!subscriptions.hasOwnProperty(topic)) {
      subscriptions[topic] = [];
    }
    subscriptions[topic].push((...args) => callback(...args, name));
  };
  console.log(`Still connecting to consumer group ${groupId} ...`);
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Kafka consumer: ${topic}`, message);
      if (subscriptions.hasOwnProperty(topic)) {
        subscriptions[topic].forEach((callback) => {
          callback(JSON.parse(message.value.toString()), new Date(parseInt(message.timestamp)));
        });
      }
    },
  });

  console.info(chalk.green(`Connected consumer group ${groupId}`));

  const awaitCallbacks = {};
  subscribe(allTopics.API_CALL, ({ msgId, resp, success }) => {
    // console.log(`Received message from topic ${allTopics.API_RESP}`, resp);
    // awaitCallbacks can be lost on restart, or in kafka server mode
    if (awaitCallbacks.hasOwnProperty(msgId)) {
      awaitCallbacks[msgId][success ? 0 : 1](resp);
      delete awaitCallbacks[msgId];
    }
  });

  return {
    send,
    subscribe,
    callAndWait: (fn, ...params) => new Promise((resolve, reject) => {
      // console.log('before sending message');
      const msgId = crypto.randomBytes(64).toString('hex');

      awaitCallbacks[msgId] = [resolve, reject];
      send(allTopics.API_RESP, { fn, params, msgId });
    }),
  };
}

module.exports = { kafka, topics: allTopics };
