const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const mongoose = require('mongoose');
const modules = require('../Backend-Kafka/services/modules');
const { kafka } = require('./kafka');
const { checkAuth } = require('./Utils/passport');
const { s3 } = require('./Utils/s3upload');

// const {
//   User, Group, Expense, Balance,
// } = require('./db_models');

const groupRouter = express.Router();

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

// send all users to NewGroup page
groupRouter.get('/userlist', async (req, res) => {
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

groupRouter.post('/upload', (req, res) => {
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
groupRouter.post('/new', async (req, res) => {
  const { status, error } = await callAndWait('newGroup', req.body);
  if (status === 200) {
    res.status(200).send({ message: 'SUCCESS' });
  }
  else {
    res.status(400).send({ error });
  }
});

// invite user to group
groupRouter.post('/invite', async (req, res) => {
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
groupRouter.get('/all', async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.query.user);
  const result = await callAndWait('getGroupList', userId);
  console.log(result);
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
groupRouter.post('/leave', async (req, res) => {
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
groupRouter.post('/accept', async (req, res) => {
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
groupRouter.get('/expense/:group', async (req, res) => {
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
groupRouter.post('/expense/add', async (req, res) => {
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
groupRouter.post('/expense/addComment', async (req, res) => {
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
groupRouter.post('/expense/deleteComment', async (req, res) => {
  // console.log(req.body);
  const { status, expenses } = await callAndWait('deleteComment', req.body);
  if (status === 200) {
    res.status(200).send({ expenses });
  }
  else {
    res.status(400).send({ error: 'DELETE_COMMENT_FAIL' });
  }
});

module.exports = groupRouter;
