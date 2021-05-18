const bcrypt = require('bcrypt');

const saltRound = 10;
const { User } = require('../db_models');

const userLogin = async (args) => {
  const user = await User.findOne({
    where: { email: args.email },
  });
  if (!user) {
    return { status: 400, message: 'NO_CUSTOMER' };
  }
  // const user = users[0];
  const match = await bcrypt.compare(args.password, user.password);
  if (match) {
    return { status: 200, message: '' };
  }
  return { status: 400, message: 'WRONG_PASSWORD' };
};

const userSignup = async (args) => {
  const user = await User.findOne({
    where: { email: args.email },
  });
  if (user) {
    return { status: 400, message: 'USER_EXISTS' };
  }
  const salt = await bcrypt.genSalt(saltRound);
  const newUser = {
    ...args, avatar: '/default.jpg', currency: 'USD', language: 'English', timezone: 'US/Pacific',
  };
  newUser.password = await bcrypt.hash(args.password, salt);
  const createUser = await User.create(newUser);
  // console.log(createUser);
  if (createUser) {
    return { status: 200, message: '' };
  }
  return { status: 400, message: 'USER_SIGNUP_FAIL' };
};

const userUpdate = async (args) => {
  const user = {
    email: args.email,
    name: args.name,
    phone: args.phone,
    currency: args.currency,
    timezone: args.timezone,
    language: args.language,
    avatar: args.avatar,
  };
  const res = await User.update(user, {
    where: { email: args.email },
  });
  if (res) {
    console.log('update success');
    return { status: 200, message: '' };
  }
  return { status: 400, message: 'PROFILE_UPDATE_FAIL' };
};

exports.userLogin = userLogin;
exports.userSignup = userSignup;
exports.userUpdate = userUpdate;
