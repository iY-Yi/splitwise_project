const mongoose = require('mongoose');

const {
  Expense, User, Balance, Group,
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
    };
    // console.log('success', data);
    return data;
  } catch (e) {
    console.log('fail', e);
    const err = {
      status: 400,
    };
    return err;
  }
}

async function settleUp(user, user2) {
  try {
    await Balance.updateMany({ user1: mongoose.Types.ObjectId(user),
      user2: mongoose.Types.ObjectId(user2) }, { $set: { clear: true } });
    await Balance.updateMany({ user1: mongoose.Types.ObjectId(user2),
      user2: mongoose.Types.ObjectId(user) }, { $set: { clear: true } });
    return ({ status: 200 });
  } catch (e) {
    return ({ status: 400 });
  }
}

async function getBalance(user) {
  try {
    const balances = await Balance.aggregate([
      {
        $match: {
          $and: [{ clear: false }, {
            $or: [{ user1: mongoose.Types.ObjectId(user) },
              { user2: mongoose.Types.ObjectId(user) }],
          }],
        },
      },
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
    return ({ balanceStatus: 200, owes, owed });
  } catch (err) {
    return ({ balanceStatus: 400 });
  }
}

async function getBalanceDetails(user) {
  try {
    const details = await Balance.aggregate([
      {
        $match: {
          $and: [{ clear: false }, {
            $or: [{ user1: mongoose.Types.ObjectId(user) },
              { user2: mongoose.Types.ObjectId(user) }],
          }],
        },
      },
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
    return ({ detailStatus: 200, details });
  } catch (e) {
    return ({ detailStatus: 400 });
  }
}

// group related functions
async function getUserList() {
  try {
    const users = await User.find({});
    // console.log(users);
    return ({ status: 200, users });
  } catch (e) {
    return ({ status: 400 });
  }
}

async function newGroup(msg) {
  // console.log(msg);
  try {
    existGroup = await Group.findOne({ name: msg.name });
    if (existGroup) {
      return ({ status: 400, error: 'GROUP_EXISTS' });
    }
    const createGroup = await new Group({
      name: msg.name,
      image: msg.image,
      users: [mongoose.Types.ObjectId(msg.creator)],
    });
    await createGroup.save();
    const creatorId = mongoose.Types.ObjectId(msg.creator);
    await User.update({ _id: creatorId }, { $push: { groups: createGroup._id } });
    return ({ status: 200 });
  } catch (e) {
    return ({ status: 400, error: 'CREATE_GROUP_FAIL' });
  }
}

async function inviteGroup(msg) {
  try {
    const group = await Group.findOne({ name: msg.groupName });
    if (group && group.users.indexOf(msg.requestor) >= 0) {
      const groupId = group._id;
      await User.update({ _id: msg.user }, { $addToSet: { invites: groupId } });
      return ({ status: 200 });     
    }
    else {
      return ({ status: 400, error: 'NOT_AUTHORIZED' });
    }
  } catch (e) {
    return ({ status: 400, error: 'INVITE_FAIL' });
  }
}

async function getGroupList(userId) {
  try {
    const user = await User.findById(userId)
    .populate('invites')
    .populate('groups');
    // console.log(users);
    return ({ status: 200, user });
  } catch (e) {
    return ({ status: 400 });
  }  
}

async function leaveGroup(userId, groupId) {
  try {
    const balances = await Balance.aggregate([
      {
        $match: {
          $and: [{ clear: false }, { group: mongoose.Types.ObjectId(groupId) },
            { $or: [{ user1: mongoose.Types.ObjectId(userId) }, { user2: mongoose.Types.ObjectId(userId) }] }],
        },
      },
      {
        $group: {
          _id: { user1: '$user1', user2: '$user2' },
          total: { $sum: '$owe' },
        },
      },
    ]);
    // console.log(balances);
    const openBalance = balances.filter((balance) => balance.total !== 0);
    if (openBalance.length != 0) {
      return ({ status: 400, error: 'OPEN_BALANCE' });
    }
    else {
      await Group.update({ _id: groupId }, { $pull: { users: userId } });
      const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $pull: { groups: groupId } }, { new: true }).populate('groups');
      console.log(updatedUser);
      return ({ status: 200, updatedUser });
    }
  } catch (e) {
    return ({ status: 400, error: 'LEAVE_GROUP_FAIL' });
  }
}

async function acceptGroup(userId, groupId) {
  try {
    await Group.update({ _id: groupId },
      { $addToSet: { users: userId } });
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, {
      $addToSet: { groups: groupId },
      $pull: { invites: groupId },
    }, { returnOriginal: false })
      .populate('invites')
      .populate('groups');
    return ({ status: 200, updatedUser });
  } catch (e) {
    return ({ status: 400 });
  }
}

async function getGroupExpense(user, group) {
  try {
    const existGroup = await Group.findById(group);
    if (existGroup === null || existGroup.users.indexOf(user) < 0) {
      throw Error('Unauthorized');
    }
    const expenses = await Expense.find({ group })
      .populate('payor', 'name')
      .sort('-date');

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

    const data = {
      group: existGroup,
      expenses,
      balances,      
    }
    return ({ status: 200, data });
  } catch (e) {
    return ({ status: 400 });
  }   
}

async function addExpense(msg) {
  try {
    // add to expense table
    const expense = await Expense.create(msg);
    // add to balance table
    const group = await Group.findById(msg.group)
      .populate('users', 'email');
    const members = group.users;
    const splitAmount = msg.amount / members.length;
    const payorEmail = await User.findById(msg.payor, 'email');
    // console.log(payorEmail);
    members.filter((member) => !member.equals(msg.payor)).map(async (member) => {
      let data = {};
      if (member.email < payorEmail.email) {
        data = {
          group: msg.group,
          description: msg.description,
          expense: expense._id,
          owe: splitAmount,
          user1: member,
          user2: msg.payor,
          clear: 0,
        };
      } else {
        data = {
          group: msg.group,
          description: msg.description,
          expense: expense._id,
          owe: -splitAmount,
          user1: msg.payor,
          user2: member,
          clear: 0,
        };
      }
      await Balance.create(data);
    });
    return ({ status: 200 });
  } catch (err) {
    return ({ status: 400 });
  } 
}

async function addComment(msg) {
  try {
    const expense = await Expense.findById(msg.expense);
    const note = { comment: msg.comment, userId: msg.userId, userName: msg.userName };
    await expense.notes.push(note);
    await expense.save();
    const expenses = await Expense.find({ group: msg.group })
      .populate('payor', 'name')
      .sort('-date');
    return ({ status: 200, expenses });
  } catch (e) {
    return ({ status: 400 });
  }
}

async function deleteComment(msg) {
  try {
    const expense = await Expense.findById(msg.expenseId);
    await expense.notes.id(msg.commentId).remove();
    await expense.save();
    const expenses = await Expense.find({ group: msg.group })
      .populate('payor', 'name')
      .sort('-date');
    return ({ status: 200, expenses });
  } catch (e) {
    return ({ status: 400 });
  }
}

module.exports = {
  // This function needs to return a promise
  // dashboard related
  getActivity,
  settleUp,
  getBalance,
  getBalanceDetails,
  // group related
  getUserList,
  newGroup,
  inviteGroup,
  getGroupList,
  leaveGroup,
  acceptGroup,
  getGroupExpense,
  addExpense,
  addComment,
  deleteComment,
};
