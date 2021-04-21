const mongoose = require('mongoose');
const { mongoDB } = require('./config');

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
    console.log('Kafka - MongoDB Connection Failed');
  } else {
    console.log('Kafka - MongoDB Connected');
  }
});

const {
  Expense, User, Balance,
} = require('./db_models');

// dashboard related
async function getActivity(userId) {
  try {
    let groups = await User.findById(userId, 'groups').populate('groups', 'name');
    groups = groups.groups;
    const groupNames = groups.map((group) => group.name);
    const groupIds = groups.map((group) => group._id);

    const activities = await Expense.find({ group: { $in: groupIds } })
      .populate('group', 'name').populate('payor', 'name').sort('-date');
    const data = {
      status: 200,
      activities,
      groups: groupNames,
    }
    // console.log('success', data);
    return data;
  } catch (e) {
    console.log('fail', e);
    const err = {
      status: 400,
    }
    return err;
  }  
}

async function settleUp(user, user2){
  try {
    await Balance.updateMany({ user1: mongoose.Types.ObjectId(user), user2: mongoose.Types.ObjectId(user2) }, { $set: { clear: true } });
    await Balance.updateMany({ user1: mongoose.Types.ObjectId(user2), user2: mongoose.Types.ObjectId(user) }, { $set: { clear: true } });
    return ({status: 200});
  } catch (e) {
    return ({status: 400});
  }
}

async function getBalance(user) {
  try {
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
    console.log(balances);
    // split data to owes and owed
    const owes = [];
    const owed = [];
    balances.map((data) => {
      let record;
      if ((data.user1 === user && data.total > 0) || (data.user2 === user && data.total < 0)) {
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
    return ({balanceStatus: 200, owes, owed});
  } catch (err) {
    return ({balanceStatus: 400});
  }
}

async function getBalanceDetails(user){
  try {
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
    return ({ detailStatus: 200, details })
  } catch(e) {
    return ({ detailStatus: 400});
  }
}


module.exports = {
  // This function needs to return a promise
  sum: async (a, b) => {
      return a + b;
  },

  // dashboard related
  getActivity,
  settleUp,
  getBalance,
  getBalanceDetails,
}
