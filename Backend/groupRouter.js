const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
// const { Sequelize, Op } = require('sequelize');
const {
  User, Group, Expense, Balance,
} = require('./db_models');
const { checkAuth } = require('./Utils/passport');

const groupRouter = express.Router();

// send all users to NewGroup page
groupRouter.get('/userlist', (req, res) => {
  // res.end(JSON.stringify(books));
  (async () => {
    try {
      const users = await User.find({});
      // console.log(users);
      res.status(200).end(JSON.stringify(users));
    } catch (e) {
      res.status(400).send({ error: 'LOADING_FAIL' });
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
  // console.log(req.body);
  // let groupId;

  Group.findOne({ name: req.body.name })
    .then((existGroup) => {
      if (existGroup) {
        res.status(400).send({ error: 'GROUP_EXISTS' });
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
      res.status(200).send({ message: 'SUCCESS' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: 'NEW_GROUP_FAIL' });
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
      res.status(400).send({ error: 'NOT_AUTHORIZED' });
    })
    .then((groupId) => User.update({ _id: req.body.user },
      { $addToSet: { invites: groupId } }))
    .then(() => res.status(200).send({ message: 'SUCCESS' }))
    .catch((err) => {
      res.status(400).send({ error: 'INVITE_FAIL' });
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
      // res.status(200).send({ user });
      res.status(200).end(JSON.stringify(user));
    } catch (e) {
      console.log(e);
      res.status(400).end(JSON.stringify(e));
    }
  })();
});

// leave group
groupRouter.post('/leave', (req, res) => {
  console.log(req.body);
  const { group, user } = req.body;
  Balance.aggregate([
    {
      $match: {
        $and: [{ clear: false }, { group: mongoose.Types.ObjectId(group) },
          { $or: [{ user1: mongoose.Types.ObjectId(user) }, { user2: mongoose.Types.ObjectId(user) }] }],
      },
    },
    {
      $group: {
        _id: { user1: '$user1', user2: '$user2' },
        total: { $sum: '$owe' },
      },
    },
  ])
    .then((data) => {
      console.log(data);
      data.map((balance) => {
        if (balance.total !== 0) {
          throw new Error('OPEN_BALANCE');
          // res.status(400).send({ error: 'FAIL: OPEN_BALANCE' });
        }
      });
    })
    .then(() => Group.update({ _id: group }, { $pull: { users: user } }))
    .then(() => User.findOneAndUpdate({ _id: user }, { $pull: { groups: group } }, { returnOriginal: false }).populate('groups'))
    .then((updatedUser) => {
      console.log(updatedUser);
      res.status(200).send(updatedUser.groups);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: 'OPEN_BALANCE' });
    });
});

// Accept group invite
groupRouter.post('/accept', (req, res) => {
  const groupId = req.body.group;
  const userId = req.body.user;
  console.log(req.body);

  (async () => {
    try {
      await Group.update({ _id: groupId },
        { $addToSet: { users: userId } });
      const updatedUser = await User.findOneAndUpdate({ _id: userId }, {
        $addToSet: { groups: groupId },
        $pull: { invites: { $in: [groupId, null] } },
      }, { returnOriginal: false })
        .populate('invites')
        .populate('groups');

      res.status(200).send(updatedUser);
    } catch (e) {
      console.log(e);
      res.status(400).send('ACCEPT_INVITE_FAIL');
    }
  })();
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

// add comment to expense
groupRouter.post('/expense/addComment', (req, res) => {
  // console.log(req.body);
  (async () => {
    try {
      const expense = await Expense.findById(req.body.expense);
      const note = { comment: req.body.comment, userId: req.body.userId, userName: req.body.userName };
      await expense.notes.push(note);
      await expense.save();
      res.status(200).send(expense);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  })();
});

// add comment to expense
groupRouter.post('/expense/deleteComment', (req, res) => {
  // console.log(req.body);
  (async () => {
    try {
      const expense = await Expense.findById(req.body.expenseId);
      await expense.notes.id(req.body.commentId).remove();
      await expense.save();
      res.status(200).send(expense);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  })();
});

module.exports = groupRouter;
