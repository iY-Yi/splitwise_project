require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const cors = require('cors');
const { mongoose } = new require('../Backend-Kafka/services/mongoose');
const { kafka } = require('./kafka');
const { checkAuth } = require('./Utils/passport');
const { auth } = require('./Utils/passport');

const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('./Utils/s3upload');


const modules = require('../Backend-Kafka/services/modules');

auth();

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
  // Forces the session to be saved back to the session store, even if the session was
  // never modified during the request
  resave: false,
  // Force to save uninitialized session to db. A session is uninitialized when 
  // it is new but not modified.
  saveUninitialized: false,
  duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.json());

// Allow Access Control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.WEB_SERVER);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});


// const userRoutes = require('./userRouter');
// const groupRoutes = require('./groupRouter');

// app.use('/user', userRoutes);
// app.use('/group', groupRoutes);

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
  } else {
    res.status(400).send({ error: 'SETTLE_FAIL' });
  }
});

// display all activities
app.get('/activity', async (req, res) => {
  // console.log(req.query.user);
  const result = await callAndWait('getActivity', req.query.user);
  console.log(result);
  const { activities, groups, status } = result;
  // console.log(status);
  if (status === 200) {
    res.status(200).send({ activities, groups });
  } else {
    res.status(400).send({ error: 'LOAD_ACTIVITY_FAIL' });
  }
});



app.post('/user/signup', async (req, res) => {
  req.body.avatar = `${process.env.S3_URL}/default.jpg`;
  req.body.currency = 'USD';
  req.body.language = 'English';
  req.body.timezone = 'US/Pacific';
  const {status, data } = await callAndWait('userSignUp', req.body);
  console.log('results: ', status, data);
  if (status === 200) {
    res.status(200).send(data);
  }
  else {
    res.status(500).send({error: 'SIGN_UP_FAIL'});
  }
});

app.post('/user/login', async (req, res) => {
  const { status, data, error } =  await callAndWait('userLogin', req.body);
  console.log('login status', status);
  if (status === 200) {
    res.status(200).send(data);
  }
  else {
    res.status(401).send({ error });
  }
});

// upload avatar image
const storage = multerS3({
  s3: s3,
  bucket: 'splitwise-project',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  key: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); //use Date.now() for unique file keys
  }
});

const upload = multer({ storage }).single('file');

app.post('/user/uploadFile', async (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file.location);
  });
});

app.post('/user/update', checkAuth, async (req, res) => {
  // console.log(req.body);
  const {status, user } = await callAndWait('userUpdate', req.body);
  console.log(user);
  if (status === 200) {
    res.status(200).send(user);
  }
  else {
    res.status(400).send({error: 'UPDATE_FAIL'});
  }
});

// groups
// send all users to NewGroup page
app.get('/group/userlist', async (req, res) => {
  const { status, users } = await callAndWait('getUserList');
  // console.log(status);
  if (status === 200) {
    res.status(200).send( users );
  }
  else {
    res.status(400).send({ error: 'LOADING_FAIL' });
  }
});

// upload group image
// const storage = multerS3({
//   s3: s3,
//   bucket: 'splitwise-project',
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   acl: 'public-read',
//   key: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`); //use Date.now() for unique file keys
//   }
// });

// const upload = multer({ storage }).single('file');

app.post('/group/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file.location);
  });
});

// create new group
app.post('/group/new', async (req, res) => {
  const { status, error } = await callAndWait('newGroup', req.body);
  if (status === 200) {
    res.status(200).send({ message: 'SUCCESS' });
  }
  else {
    res.status(400).send({ error });
  }
});

// invite user to group
app.post('/group/invite', async (req, res) => {
  // console.log(req.body);
  const { status, error } = await callAndWait('inviteGroup', req.body);
  if (status === 200) {
    res.status(200).send({ message: 'SUCCESS' });
  }
  else {
    res.status(400).send({ error });
  }
});

// display all groups
app.get('/group/all', async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.query.user);
  const result = await callAndWait('getGroupList', userId);
  console.log('get group list result ', result);
  const { status, user } = result;
  console.log(status, user);
  if (status === 200) {
    res.status(200).end(JSON.stringify(user));
  }
  else {
    res.status(400).send({ error: 'GROUPS_LOADING_FAIL' });
  }
});

// leave group
app.post('/group/leave', async (req, res) => {
  // console.log(req.body);
  const { group, user } = req.body;
  const { status, updatedUser } = await callAndWait('leaveGroup', user, group);
  if (status === 200) {
    res.status(200).send(updatedUser.groups);
  }
  else {
    res.status(400).send({ error: 'OPEN_BALANCE' });
  }
});

// Accept group invite
app.post('/group/accept', async (req, res) => {
  const groupId = req.body.group;
  const userId = req.body.user;

  const { status, updatedUser } = await callAndWait('acceptGroup', userId, groupId);
  if (status === 200) {
    res.status(200).send(updatedUser);
  }
  else {
    res.status(400).send('ACCEPT_INVITE_FAIL');
  }
});

// get group expense list
app.get('/group/expense/:group', async (req, res) => {
  const { group } = req.params;
  const { user } = req.query;
  const { status, data } = await callAndWait('getGroupExpense', user, group);
  if (status === 200) {
    res.status(200).send(data);
  }
  else {
    res.status(400).send({ error: 'UNAUTHORIZED' });
  }
});

// add new expense
app.post('/group/expense/add', async (req, res) => {
  // console.log(req.body);
  const { status } = await callAndWait('addExpense', req.body);
  if (status === 200) {
    res.status(200).send();
  }
  else {
    res.status(400).send({ error: 'ADD_EXPENSE_FAIL' });
  }
});


// add comment to expense
app.post('/group/expense/addComment', async (req, res) => {
  // console.log(req.body);
  const { status, expenses } = await callAndWait('addComment', req.body);
  if (status === 200) {
    res.status(200).send({ expenses });
  }
  else {
    res.status(400).send({ error: 'ADD_COMMENT_FAIL' });
  }
});

// delete expense comment
app.post('/group/expense/deleteComment', async (req, res) => {
  // console.log(req.body);
  const { status, expenses } = await callAndWait('deleteComment', req.body);
  if (status === 200) {
    res.status(200).send({ expenses });
  }
  else {
    res.status(400).send({ error: 'DELETE_COMMENT_FAIL' });
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
