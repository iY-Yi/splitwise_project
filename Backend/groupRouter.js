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

// create new group
groupRouter.post('/new', (req, res) => {
  req.body.count = 1;
  console.log(req.body);

  Group.create(req.body)
    .then(() => {
      GroupUser.create({
        groupName: req.body.name,
        userEmail: req.body.creator,
        accepted: 1,
      });
    })
    .then(() => res.status(200).end())
    .catch((err) => {
      console.log(err);
      res.status(400).send(JSON.stringify(err));
    });
});

// invite user to group
groupRouter.post('/invite', (req, res) => {
  GroupUser.create(req.body)
    .then(() => res.status(200).end())
    .catch((err) => {
      console.log(err);
      res.status(400).send(JSON.stringify(err));
    });
});

// display all groups
groupRouter.get('/all', (req, res) => {
  console.log(req.query);
  (async () => {
    const invites = await GroupUser.findAll({
      where: {
        userEmail: req.query.user,
        accepted: 0,
      },
    });
    const groups = await GroupUser.findAll({
      where: {
        userEmail: req.query.user,
        accepted: 1,
      },
    });
    res.status(200).send({
      invites,
      groups,
    });
  })();
});

// leave group
groupRouter.post('/leave', (req, res) => {
  console.log(req.body);
  Group.findByPk(req.body.groupName)
    .then((p) => {
      console.log(p);
      p.count -= 1;
      p.save();
    })
    .then(() => {
      GroupUser.destroy({
        where: {
          userEmail: req.body.userEmail,
          groupName: req.body.groupName,
        },
      });
    })
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(JSON.stringify(err));
    });
});

// Accept group invite
groupRouter.post('/accept', (req, res) => {
  console.log(req.body);
  (async () => {
    try {
      const data = await GroupUser.findOne({
        where: {
          groupName: req.body.groupName,
          userEmail: req.body.userEmail,
        },
      });
      data.accepted = 1;
      await data.save();
      const group = await Group.findByPk(req.body.groupName);
      group.count += 1;
      await group.save();
      res.status(200).end();
    } catch (err) {
      res.status(400).send(err);
    }
  })();
});

module.exports = groupRouter;
