const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { Sequelize, Op } = require('sequelize');
const {
  User, Group, Invite, Expense, Balance,
} = require('./db_models');

const groupRouter = express.Router();

// send all users to NewGroup page
groupRouter.get('/new', (req, res) => {
  // res.end(JSON.stringify(books));
  (async () => {
    try {
      const users = await User.find({});
      // console.log(users);
      res.status(200).end(JSON.stringify(users));
    } catch (e) {
      res.status(400).end();
    }
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
  // let groupId;

  Group.findOne({ name: req.body.name })
    .then((existGroup) => {
      if (existGroup) {
        res.status(400).send({
          errors: {
            body: 'GROUP_EXISTS',
          },
        });
      }
      const newGroup = new Group({
        name: req.body.name,
        image: req.body.image,
        users: [mongoose.Types.ObjectId(req.body.creator)],
      });
      return newGroup.save();
    })
    .then((group) => {
      console.log(group);
      // groupId = group._id;
      const creatorId = mongoose.Types.ObjectId(req.body.creator);
      return User.update({ _id: creatorId },
        { $push: { groups: group._id } });
    })
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(JSON.stringify(err));
    });
});

// invite user to group
groupRouter.post('/invite', (req, res) => {
  console.log(req.body);
  Group.findOne({ name: req.body.groupName })
    .then((group) => {
      if (group && group.users.indexOf(req.body.requestor) >= 0) {
        console.log('Authorized');
        return group._id;
      }
      res.status(400).send({
        errors: {
          body: 'NOT_AUTHORIZED',
        },
      });
    })
    .then((groupId) => User.update({ _id: req.body.user },
      { $addToSet: { invites: groupId } }))
    .then(() => res.status(200).end())
    .catch((err) => {
      res.status(400).send(JSON.stringify(err));
    });
});

// display all groups
groupRouter.get('/all', (req, res) => {
  const userId = mongoose.Types.ObjectId(req.query.user);
  (async () => {
    try {
      const user = await User.findById(userId)
        .populate('invites')
        .populate('groups');
      res.status(200).send({ user });
    } catch (e) {
      console.log(e);
      res.status(400).end();
    }
  })();
});

// leave group
groupRouter.post('/leave', (req, res) => {
  // console.log(req.body);
  Balance.findAll({
    where: {
      clear: 0,
      group: req.body.groupName,
      [Op.or]: { user1: req.body.userEmail, user2: req.body.userEmail },
    },
    group: ['user1', 'user2'],
    attributes: ['user1', 'user2', [Sequelize.fn('sum', Sequelize.col('owe')), 'total']],
    raw: true,
  })
    .then((data) => {
      data.map((balance) => {
        if (balance.total !== 0) {
          throw new Error('OPEN_BALANCE');
        }
      });
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
      // console.log(err);
      res.status(400).send(err);
    });
});

// Accept group invite
groupRouter.put('/accept', (req, res) => {
  const groupId = req.body.group;
  const userId = req.body.user;

  Group.update({ _id: groupId },
    { $addToSet: { users: userId } })
    .then(() => User.update({ _id: userId },
      { $addToSet: { groups: groupId }, $pull: { invites: groupId } }))
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

groupRouter.get('/expense/:group', (req, res) => {
  const { group } = req.params;
  (async () => {
    try {
      const existGroup = await Group.findById(group);
      if (existGroup === null || existGroup.users.indexOf(req.query.user) < 0) {
        throw Error('Unauthorized');
      }
      const expenses = await Expense.find({ group })
        .populate('payor', 'name')
        .sort('-date');

      expenses.map((exp) => {
        exp.date = exp.date.toLocaleString('en-US', { timeZone: req.query.timezone });
        // console.log(exp.formatDate);
        // console.log(exp);
      });
      // console.log(expenses);
      // console.log(expenses[0].payor.name);
      const balances = await Balance.aggregate([
        { $match: { $and: [{ clear: false }, { group: mongoose.Types.ObjectId(group) }] } },
        {
          $group: {
            _id: { user1: '$user1', user2: '$user2' },
            total: { $sum: '$owe' },
          },
        },
        {
          $project: {
            user1: '$_id.user1',
            user2: '$_id.user2',
            total: 1,
            _id: 0,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user1',
            foreignField: '_id',
            as: 'U1',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user2',
            foreignField: '_id',
            as: 'U2',
          },
        },
      ]);
      // console.log(balances);
      // console.log(balances[0].U1);
      // console.log(balances[0].U1[0].name);
      // const balances = await Balance.findAll({
      //   where: {
      //     clear: 0,
      //     group,
      //   },
      //   include: [{ model: User, as: 'U1' }, { model: User, as: 'U2' }],
      //   group: ['user1', 'user2'],
      //   attributes: ['user1', 'user2', [Sequelize.fn('sum', Sequelize.col('owe')), 'total']],
      // });
      // console.log(balances);
      res.status(200).send({
        expenses,
        balances,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  })();
});

// add new expense
groupRouter.post('/expense/add', (req, res) => {
  // console.log(req.body);
  (async () => {
    try {
      // add to expense table
      const expense = await Expense.create(req.body);
      // add to balance table
      const group = await Group.findById(req.body.group)
        .populate('users', 'email');
      const members = group.users;
      const splitAmount = req.body.amount / members.length;
      const payorEmail = await User.findById(req.body.payor, 'email');
      // console.log(payorEmail);
      members.filter((member) => !member.equals(req.body.payor)).map(async (member) => {
        let data = {};
        if (member.email < payorEmail.email) {
          data = {
            group: req.body.group,
            description: req.body.description,
            expense: expense._id,
            owe: splitAmount,
            user1: member,
            user2: req.body.payor,
            clear: 0,
          };
        } else {
          data = {
            group: req.body.group,
            description: req.body.description,
            expense: expense._id,
            owe: -splitAmount,
            user1: req.body.payor,
            user2: member,
            clear: 0,
          };
        }
        await Balance.create(data);
      });

      res.status(200).end();
    } catch (err) {
      res.status(400).send(err);
    }
  })();
});

module.exports = groupRouter;
