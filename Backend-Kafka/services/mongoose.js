require('dotenv').config();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 40,
  bufferMaxEntries: 0,
  useFindAndModify: false,
};

mongoose.connect(process.env.MONGODB_URL, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log('MongoDB Connection Failed');
  } else {
    console.log('Kafka Backend MongoDB Connected');
  }
});

module.exports = {mongoose};