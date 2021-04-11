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

  User.findOne({ email: req.body.email }, (error, existUser) => {
    if (error) {
      res.status(500).end(error);
    }
    if (existUser) {
      console.log(existUser);
      res.status(400).send({
        errors: {
          body: 'USER_EXISTS',
        },
      });
    } else {
      (async () => {
        try {
          const salt = await bcrypt.genSalt(saltRound);
          req.body.password = await bcrypt.hash(req.body.password, salt);
          const newUser = new User(req.body);
          newUser.save()
            .then(() => {
              res.cookie('user', newUser.email, { maxAge: 86400000, httpOnly: false, path: '/' });
              res.cookie('currency', newUser.currency, { maxAge: 86400000, httpOnly: false, path: '/' });
              res.cookie('timezone', newUser.timezone, { maxAge: 86400000, httpOnly: false, path: '/' });
              res.status(200).end(JSON.stringify(newUser));
            });
        } catch (err) {
          res.status(500).end(JSON.stringify(err));
        }
      })();
    }
  });
});

userRouter.post('/login', (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).send('WRONG_PASSWORD');
      } else {
        bcrypt.compare(req.body.password, user.password, (err, match) => {
          // console.log(match);
          if (match) {
            res.cookie('user', user.email, { maxAge: 86400000, httpOnly: false, path: '/' });
            res.cookie('currency', user.currency, { maxAge: 86400000, httpOnly: false, path: '/' });
            res.cookie('timezone', user.timezone, { maxAge: 86400000, httpOnly: false, path: '/' });
            res.status(200).end(JSON.stringify(user));
          } else if (!match) {
            res.status(401).send('WRONG_PASSWORD');
          }
          if (err) {
            throw new Error('BRCYPT_ERROR');
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

userRouter.get('/profile/:email', (req, res) => {
  const { email } = req.params;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(400).end();
      }
    })
    .catch((e) => {
      res.status(400).end();
    });
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
  User.findOneAndUpdate({ _id: req.body._id }, req.body)
    .then((user) => {
      console.log('saved');
      res.cookie('currency', req.body.currency, { maxAge: 86400000, httpOnly: false, path: '/' });
      res.cookie('timezone', req.body.timezone, { maxAge: 86400000, httpOnly: false, path: '/' });
      res.status(200).end();
    })
    .catch((e) => {
      res.status(400).end();
    });
});

module.exports = userRouter;
