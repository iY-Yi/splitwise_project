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
    .then((groupId) => {
      const newInvite = new Invite({
        group: groupId,
        user: req.body.user,
      });
      return newInvite.save();
    })
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
      const invites = await Invite.find({
        user: userId,
      })
        .populate('group');
      console.log(invites[0].group.name);
      const user = await User.findById(userId).populate('group');
      console.log(user);
      console.log(user.groups);
      res.status(200).send({
        invites,
        user,
      });
    } catch (e) {
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
      { $addToSet: { groups: groupId } }))
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  // (async () => {
  //   try {
  //     await GroupUser.update({ accepted: 1 }, {
  //       where: {
  //         groupName: req.body.groupName,
  //         userEmail: req.body.userEmail,
  //       },
  //     });
  //     res.status(200).end();
  //   } catch (err) {
  //     res.status(400).send(err);
  //   }
  // })();
});

groupRouter.get('/expense/:group', (req, res) => {
  const { group } = req.params;
  (async () => {
    try {
      const groupUser = await GroupUser.findOne({
        where: {
          groupName: group,
          userEmail: req.query.user,
          accepted: 1,
        },
      });
      if (groupUser === null) {
        throw Error('Unauthorized');
      }
      const expenses = await Expense.findAll({
        attributes: ['date', 'email', 'description', 'amount'],
        where: {
          group,
        },
        include: [{
          model: User,
          attributes: ['name'],
        }],
        order: [['date', 'DESC']],
        raw: true,
      });
      expenses.map((exp) => {
        exp.date = exp.date.toLocaleString('en-US', { timeZone: req.query.timezone });
        // console.log(exp.formatDate);
        // console.log(exp);
      });
      const balances = await Balance.findAll({
        where: {
          clear: 0,
          group,
        },
        include: [{ model: User, as: 'U1' }, { model: User, as: 'U2' }],
        group: ['user1', 'user2'],
        attributes: ['user1', 'user2', [Sequelize.fn('sum', Sequelize.col('owe')), 'total']],
      });
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
      await Expense.create(req.body);
      // add to balance table
      const { count, rows } = await GroupUser.findAndCountAll({
        attributes: ['userEmail'],
        where: {
          groupName: req.body.group,
          accepted: 1,
        },
      });
      const splitAmount = req.body.amount / count;
      rows.filter((row) => row.userEmail !== req.body.email).map(async (row) => {
        let data = {};
        if (row.userEmail < req.body.email) {
          data = {
            group: req.body.group,
            description: req.body.description,
            owe: splitAmount,
            user1: row.userEmail,
            user2: req.body.email,
            clear: 0,
          };
        } else {
          data = {
            group: req.body.group,
            description: req.body.description,
            owe: -splitAmount,
            user1: req.body.email,
            user2: row.userEmail,
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
