require('dotenv').config();
const { mongoose } = new require('./services/mongoose');
const { kafka, topics } = require('../Backend/kafka');
const modules = require('./services/modules');

(async () => {
  const k = await kafka();
  k.subscribe(topics.API_CALL, ({ fn, params, msgId }) => {
    console.log('In kafka server', fn, params, msgId);
    modules[fn](...params)
      .then(
        (resp) => {
          k.send(topics.API_RESP, { msgId, resp, success: true });
        },
        (resp) => {
          k.send(topics.API_RESP, { msgId, resp, success: false });
        },
      );
  }, 'Kafka Server');
})();
