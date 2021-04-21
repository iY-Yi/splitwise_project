require('dotenv').config();

const express = require('express');
const { kafka } = require('./kafka');
const bodyParser = require('body-parser');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { checkAuth } = require('./Utils/passport');

const WEB_SERVER = 'http://localhost:3000';

const modules = require('../Backend-Kafka/services/modules');

let callAndWait = () => {
  console.log('Kafka client has not connected yet, message will be lost');
};

(async () => {
  if (process.env.MOCK_KAFKA === 'false') {
    const k = await kafka();
    callAndWait = k.callAndWait;
  } else {
    callAndWait = async (fn, ...params) => modules[fn](...params);
    console.log('Connected to dev kafka. Need to add services.');
  }
})();

const app = express();
app.use(express.json());
// // use cors to allow cross origin resource sharing
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors());

// use express session to maintain session data
app.use(session({
  secret: 'cmpe273_splitwise',
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.json());

// Allow Access Control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', WEB_SERVER);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

const { mongoDB } = require('./Utils/config');
const {
  Expense, User, Balance,
} = require('./db_models');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 50,
  bufferMaxEntries: 0,
  useFindAndModify: false,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log('MongoDB Connection Failed');
  } else {
    console.log('MongoDB Connected');
  }
});

const userRoutes = require('./userRouter');
const groupRoutes = require('./groupRouter');

app.use('/user', userRoutes);
app.use('/group', groupRoutes);

// for kafka test
app.post('/sum', async (req, res) => {
  console.log(req.body);
  const sum = await callAndWait('sum', req.body.a, req.body.b);
  res.status(200).send({ sum });
});

// display balances in dashboard
app.get('/dashboard', checkAuth, async (req, res) => {
  const { user } = req.query;
  const { owes, owed, detailStatus } = await callAndWait('getBalance', user);
  const { details, balanceStatus } = await callAndWait('getBalanceDetails', user);
  if (detailStatus === 400 || balanceStatus === 400) {
    res.status(400).send({ error: 'LOADING_FAIL' });
  } else {
    res.status(200).send({
      owes, owed, details,
    });    
  }
});

// settle up transaction between two users
app.post('/settle', checkAuth, async (req, res) => {
  // console.log(req.body);
  const { user, user2 } = req.body;
  const { status } = await callAndWait('settleUp', user, user2); 
  if (status === 200) {
    res.status(200).send();
  }
  else {
    res.status(400).send({ error: 'SETTLE_FAIL' });
  }
});

// display all activities
app.get('/activity', async (req, res) => {
  // console.log(req.query.user);
  const { activities, groups, status } = await callAndWait('getActivity', req.query.user);
  // console.log(status);
  if (status === 200) {
    res.status(200).send({ activities, groups, });
  }
  else {
    res.status(400).send({ error: 'LOAD_ACTIVITY_FAIL' });
  }
});

app.get('/error', (req, res, next) => {
  // some error in this request
  const err = true;
  if (err) {
    next('Error in the API');
  } else {
    res.json({
      result: 'success',
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;

app.listen(parseInt(process.env.PORT), () => console.log(`Backend server listening on port ${process.env.PORT}!`));
