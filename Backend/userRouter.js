require('dotenv').config();
const express = require('express');
// password encryption
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRound = 10;
const multer = require('multer');
const multerS3 = require('multer-s3');
const { User } = require('./db_models');
const { secret } = require('./Utils/config');
const { auth } = require('./Utils/passport');
const { checkAuth } = require('./Utils/passport');
const { s3 } = require('./Utils/s3upload');
const { kafka } = require('./kafka');
const modules = require('../Backend-Kafka/services/modules');

const userRouter = express.Router();

auth();

// kafka setup
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


userRouter.post('/signup', async (req, res) => {
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

// use kafka
userRouter.post('/login', async (req, res) => {
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

userRouter.post('/uploadFile', async (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file.location);
  });
});

userRouter.post('/update', checkAuth, async (req, res) => {
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

module.exports = userRouter;
