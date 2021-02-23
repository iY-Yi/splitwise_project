const express = require('express');
// password encryption
const bcrypt = require('bcrypt');

const saltRound = 10;
const { sequelize, User } = require('./db_connection');

const userRouter = express.Router();

userRouter.post('/signup', (req, res) => {
  (async () => {
    try {
      const salt = await bcrypt.genSalt(saltRound);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      const newUser = await User.create(req.body);
      console.log(JSON.stringify(newUser));
      res.status(200).end();
    } catch (err) {
      console.log(err);
      res.status(400).end(JSON.stringify(err));
    }
  })();
});

userRouter.post('/login', (req, res) => {
  console.log(req.body);
  (async () => {
    const users = await User.findAll({
      where: { email: req.body.email },
    });
    const user = users[0];
    const match = await bcrypt.compare(req.body.password, user.password);
    console.log(req.body.password, user.password, match);
    if (match) {
      res.cookie('user', user.email, { maxAge: 900000, httpOnly: false, path: '/' });
      res.status(200).end();
    } else {
      res.status(401).end();
    }
  })();
});

userRouter.get('/profile/:email', (req, res) => {
  const { email } = req.params;
  (async () => {
    const users = await User.findAll({
      attributes: ['email', 'name', 'phone', 'currency', 'timezone', 'language', 'avatar'],
      where: { email },
    });
    const user = users[0];
    console.log(JSON.stringify(user));
    res.status(200).end(JSON.stringify(user));
  })();
});

module.exports = userRouter;
