const express = require('express');

const app = express();
const port = 3001;

const bodyParser = require('body-parser');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
const { checkAuth } = require('./Utils/passport');

app.set('view engine', 'ejs');

// // use cors to allow cross origin resource sharing
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors());

// use express session to maintain session data
app.use(session({
  secret: 'cmpe273_splitwise',
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.json());

// Allow Access Control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// app.get('/', (req, res) => {
//   res.redirect('/Navbar');
// });

// const { Sequelize, Op } = require('sequelize');

const mongoose = require('mongoose');
const { mongoDB } = require('./Utils/config');
const {
  Expense, User, Balance,
} = require('./db_models');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 50,
  bufferMaxEntries: 0,
  useFindAndModify: false,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log('MongoDB Connection Failed');
  } else {
    console.log('MongoDB Connected');
  }
});

const userRoutes = require('./userRouter');
const groupRoutes = require('./groupRouter');

app.use('/user', userRoutes);
app.use('/group', groupRoutes);

// display transactions in dashboard
app.get('/dashboard', checkAuth, (req, res) => {
  (async () => {
    try {
      const { user } = req.query;
      // console.log(user);
      const balances = await Balance.aggregate([
        { $match: { $and: [{ clear: false }, { $or: [{ user1: mongoose.Types.ObjectId(user) }, { user2: mongoose.Types.ObjectId(user) }] }] } },
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
      // split data to owes and owed
      const owes = [];
      const owed = [];
      balances.map((data) => {
        let record;
        if ((data.user1 === req.query.user && data.total > 0) || (data.user2 === req.query.user && data.total < 0)) {
          if (data.total < 0) {
            record = { balance: -data.total, userId: data.user1, name: data.U1[0].name };
          } else {
            record = { balance: data.total, userId: data.user2, name: data.U2[0].name };
          }
          owes.push(record);
        } else {
          if (data.total < 0) {
            record = { balance: -data.total, userId: data.user2, name: data.U2[0].name };
          } else {
            record = { balance: data.total, userId: data.user1, name: data.U1[0].name };
          }
          owed.push(record);
        }
      });
      // console.log(owes);
      // console.log(owed);
      // balance details
      const details = await Balance.aggregate([
        { $match: { $and: [{ clear: false }, { $or: [{ user1: mongoose.Types.ObjectId(user) }, { user2: mongoose.Types.ObjectId(user) }] }] } },
        {
          $group: {
            _id: { user1: '$user1', user2: '$user2', group: '$group' },
            total: { $sum: '$owe' },
          },
        },
        {
          $project: {
            user1: '$_id.user1',
            user2: '$_id.user2',
            group: '$_id.group',
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
        {
          $lookup: {
            from: 'groups',
            localField: 'group',
            foreignField: '_id',
            as: 'groupDetails',
          },
        },
      ]);
      // console.log(details);
      res.status(200).send({
        owes, owed, details,
      });
    } catch (err) {
      res.status(400).end();
    }
  })();
});

// settle up transaction between two users
app.post('/settle', checkAuth, (req, res) => {
  console.log(req.body);
  const { user, user2 } = req.body;
  // update clear flag to 1
  (async () => {
    try {
      await Balance.updateMany({ user1: mongoose.Types.ObjectId(user), user2: mongoose.Types.ObjectId(user2) }, { $set: { clear: true } });
      await Balance.updateMany({ user1: mongoose.Types.ObjectId(user2), user2: mongoose.Types.ObjectId(user) }, { $set: { clear: true } });
      res.status(200).end();
    } catch (e) {
      res.status(400).end();
    }
  })();
});

// display all activities
app.get('/activity', (req, res) => {
  (async () => {
    try {
      let groups = await User.findById(req.query.user, 'groups').populate('groups', 'name');
      groups = groups.groups;
      const groupNames = groups.map((group) => group.name);
      const groupIds = groups.map((group) => group._id);
      // console.log(groupNames);

      const activities = await Expense.find({ group: { $in: groupIds } })
        .populate('group', 'name').populate('payor', 'name').sort('-date');
      // console.log(activities);

      // activities.map((act) => {
      //   console.log(act.date.toLocaleString('en-US', { timeZone: req.query.timezone }));
      //   // act.date = act.date.toLocaleString('en-US', { timeZone: req.query.timezone });
      // });
      // console.log(activities);
      res.status(200).send({
        activities,
        groupNames,
      });
    } catch (e) {
      res.status(400).end();
    }
  })();
});

app.get('/error', (req, res, next) => {
  // some error in this request
  const err = true;
  if (err) {
    next('Error in the API');
  } else {
    res.json({
      result: 'success',
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;

app.listen(port, () => console.log(`Backend server listening on port ${port}!`));
