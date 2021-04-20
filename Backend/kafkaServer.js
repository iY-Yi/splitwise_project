require('dotenv').config();
const { kafka, topics } = require('./kafka');
const modules = require('./modules');

(async () => {
    const k = await kafka();
    k.subscribe(topics.API_CALL, ({ fn, params, msgId }) => {
        console.log("In kafka server", fn, params, msgId);
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