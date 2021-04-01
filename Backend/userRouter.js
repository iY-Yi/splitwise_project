const express = require('express');
// password encryption
const bcrypt = require('bcrypt');

const saltRound = 10;
const multer = require('multer');
const { User } = require('./db_models');

const userRouter = express.Router();

userRouter.post('/signup', (req, res) => {
  req.body.avatar = '/default.jpg';
  req.body.currency = 'USD';
  req.body.language = 'English';
  req.body.timezone = 'US/Pacific';
  // console.log(req.body);
  (async () => {
    try {
      const salt = await bcrypt.genSalt(saltRound);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      const newUser = await User.create(req.body);
      // console.log(JSON.stringify(newUser));
      res.cookie('user', newUser.email, { maxAge: 86400000, httpOnly: false, path: '/' });
      res.cookie('currency', newUser.currency, { maxAge: 86400000, httpOnly: false, path: '/' });
      res.cookie('timezone', newUser.timezone, { maxAge: 86400000, httpOnly: false, path: '/' });
      res.status(200).end(JSON.stringify(newUser));
    } catch (err) {
      // console.log(err);
      res.status(400).end(JSON.stringify(err));
    }
  })();
});

userRouter.post('/login', (req, res) => {
  // console.log(req.body);
  (async () => {
    try {
      const user = await User.findOne({
        where: { email: req.body.email },
      });
      // const user = users[0];
      const match = await bcrypt.compare(req.body.password, user.password);
      // console.log(req.body.password, user.password, match);
      if (match) {
      // 24 hours cookie
        res.cookie('user', user.email, { maxAge: 86400000, httpOnly: false, path: '/' });
        res.cookie('currency', user.currency, { maxAge: 86400000, httpOnly: false, path: '/' });
        res.cookie('timezone', user.timezone, { maxAge: 86400000, httpOnly: false, path: '/' });
        res.status(200).end(JSON.stringify(user));
      } else {
        // res.status(401).end('Incorrect username or password.');
        throw new Error('WRONG_PASSWORD');
      }
    } catch (error) {
      // console.log(error);
      res.status(401).send('WRONG_PASSWORD');
    }
  })();
});

userRouter.get('/profile/:email', (req, res) => {
  const { email } = req.params;
  (async () => {
    try {
      const users = await User.findAll({
        where: { email },
      });
      const user = users[0];
      // console.log('Profile:', JSON.stringify(user));
      res.status(200).send(user);
    } catch (e) {
      res.status(400).end();
    }
  })();
});

// upload avatar image
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../Frontend/public/images'); // save impages to frontend
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }).single('file');

userRouter.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file.filename);
  });
});

userRouter.post('/update', (req, res) => {
  // console.log(req.body);
  const { email } = req.body;
  (async () => {
    try {
      await User.update(req.body, {
        where: { email },
      });
      res.cookie('currency', req.body.currency, { maxAge: 86400000, httpOnly: false, path: '/' });
      res.cookie('timezone', req.body.timezone, { maxAge: 86400000, httpOnly: false, path: '/' });
      res.status(200).end();
    } catch (e) {
      res.status(400).end();
    }
  })();
});

module.exports = userRouter;
