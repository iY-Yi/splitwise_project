const express = require('express');
const multer = require('multer');
const { User, Group, GroupUser } = require('./db_models');

const groupRouter = express.Router();

// send all users to NewGroup page
groupRouter.get('/new', (req, res) => {
  // res.end(JSON.stringify(books));
  (async () => {
    const users = await User.findAll();
    res.status(200).end(JSON.stringify(users));
  })();
});

// upload group image
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../Frontend/public/images'); // save impages to frontend
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }).single('file');

groupRouter.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file.filename);
  });
});

groupRouter.post('/new', (req, res) => {
  req.body.count = 1;
  console.log(req.cookies);
  (async () => {
    try {
      await Group.create(req.body);
      res.status(200).end();
    } catch (err) {
      console.log(err);
      res.status(400).send(JSON.stringify(err));
    }
  })();
});

module.exports = groupRouter;
