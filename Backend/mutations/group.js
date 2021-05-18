const { Group, GroupUser } = require('../db_models');

const newGroup = async (args) => {
  try {
    const group = {
      name: args.name, image: args.image,
    };
    await Group.create(group);
    await GroupUser.create({
      groupName: args.name,
      userEmail: args.creator,
      accepted: 1,
    });
    return { status: 200, message: '' };
  } catch (err) {
    return { status: 400, message: 'NEW_GROUP_FAIL' };
    // res.status(400).end(JSON.stringify(err));
  }
};

const userInvite = async (args) => {
  try {
    const group = await GroupUser.findOne({
      where: {
        groupName: args.groupName,
        userEmail: args.requestor,
        accepted: 1,
      },
    });
    if (!group) {
      return { status: 400, message: 'NOT_AUTHORIZED' };
    }
    const newInvite = {
      groupName: args.groupName,
      userEmail: args.userEmail,
      accepted: 0,
    };
    await GroupUser.create(newInvite);
    return { status: 200, message: '' };
  } catch (err) {
    console.log(err);
    return { status: 400, message: 'USER_INVITE_FAIL' };
    // res.status(400).end(JSON.stringify(err));
  }
};

exports.newGroup = newGroup;
exports.userInvite = userInvite;
