const express = require('express');

const app = express();
const port = 3001;

const bodyParser = require('body-parser');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const cors = require('cors');

app.set('view engine', 'ejs');

// // use cors to allow cross origin resource sharing
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors());

const { Sequelize, Op } = require('sequelize');
const {
  Expense, User, GroupUser, Balance,
} = require('./db_models');

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

const userRoutes = require('./userRouter');
const groupRoutes = require('./groupRouter');

app.use('/user', userRoutes);
app.use('/group', groupRoutes);

// display transactions in dashboard
app.get('/dashboard', (req, res) => {
  (async () => {
    const balances = await Balance.findAll({
      where: {
        [Op.and]: [{ clear: 0 }, { [Op.or]: [{ user1: req.query.user }, { user2: req.query.user }] }],
      },
      include: [{ model: User, as: 'U1', attributes: ['name'] }, { model: User, as: 'U2', attributes: ['name'] }],
      group: ['user1', 'user2'],
      attributes: ['user1', 'user2', [Sequelize.fn('sum', Sequelize.col('owe')), 'total']],
      raw: true,
    });
    // split data to owes and owed
    const owes = [];
    const owed = [];
    balances.map((data) => {
      if ((data.user1 === req.query.user && data.total > 0) || (data.user2 === req.query.user && data.total < 0)) {
        if (data.total < 0) {
          data.balance = -data.total;
          data.email = data.user1;
          data.name = data['U1.name'];
        } else {
          data.balance = data.total;
          data.email = data.user2;
          data.name = data['U2.name'];
        }
        owes.push(data);
      } else {
        if (data.total < 0) {
          data.balance = -data.total;
          data.email = data.user2;
          data.name = data['U2.name'];
        } else {
          data.balance = data.total;
          data.email = data.user1;
          data.name = data['U1.name'];
        }
        owed.push(data);
      }
    });
    // balance details
    const details = await Balance.findAll({
      where: {
        [Op.and]: [{ clear: 0 }, { [Op.or]: [{ user1: req.query.user }, { user2: req.query.user }] }],
      },
      include: [{ model: User, as: 'U1', attributes: ['name'] }, { model: User, as: 'U2', attributes: ['name'] }],
      group: ['user1', 'user2', 'group'],
      attributes: ['user1', 'user2', 'group', [Sequelize.fn('sum', Sequelize.col('owe')), 'total']],
      raw: true,
    });
    res.status(200).send({
      owes, owed, details,
    });
  })();
});

// settle up transaction between two users
app.post('/settle', (req, res) => {
  // console.log(req.body);
  // update clear flag to 1
  (async () => {
    await Balance.update({ clear: 1 }, {
      where: {
        [Op.or]: [{ [Op.and]: [{ user1: req.body.user }, { user2: req.body.user2 }] },
          { [Op.and]: [{ user1: req.body.user2 }, { user2: req.body.user }] }],
      },
    });
    res.status(200).end();
  })();
});

// display all activities
app.get('/activity', (req, res) => {
  (async () => {
    const groups = await GroupUser.findAll({
      attributes: ['groupName'],
      where: {
        userEmail: req.query.user,
        accepted: 1,
      },
      raw: true,
    });
    const groupNames = groups.map((group) => group.groupName);
    // console.log(groupNames);
    const activities = await Expense.findAll({
      where: {
        group: groupNames,
      },
      include: [{ model: User, attributes: ['name'] }],
      order: [['date', 'DESC']],
      raw: true,
    });
    activities.map((act) => {
      act.formatDate = act.date.toLocaleString('en-US', { timeZone: req.query.timezone });
    });
    // console.log(activities);
    res.status(200).send({
      activities,
      groupNames,
    });
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
