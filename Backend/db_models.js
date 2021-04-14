const mongoose = require('mongoose');

const { Schema } = mongoose;

// Sequelize connection, TO DELETE
const { Sequelize, DataTypes } = require('sequelize');
const config = require('./db_config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  logging: false, // disable logging; defailt: console.log
});

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String },
  currency: { type: String },
  timezone: { type: String },
  language: { type: String },
  groups: [{ type: Schema.ObjectId, ref: 'group' }],
}, {
  versionKey: false,
});

const User = mongoose.model('user', userSchema);

const groupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
  users: [{ type: Schema.ObjectId, ref: 'user' }],
}, {
  versionKey: false,
});

const Group = mongoose.model('group', groupSchema);

const inviteSchema = new Schema({
  group: { type: Schema.ObjectId, ref: 'group', required: true },
  user: { type: Schema.ObjectId, ref: 'user', required: true },
  // accepted: { type: Boolean },
}, {
  versionKey: false,
});

const Invite = mongoose.model('invite', inviteSchema);

const Expense = sequelize.define('expense', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  group: DataTypes.STRING,
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  email: DataTypes.STRING,
  description: DataTypes.STRING,
  amount: DataTypes.DECIMAL,
}, {
  tableName: 'expense',
  timestamps: false,
});

// User.hasMany(Expense);
// Expense.belongsTo(User, { foreignKey: 'email' });

// balance calculation
const Balance = sequelize.define('balance', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  group: DataTypes.STRING,
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  description: DataTypes.STRING,
  user1: DataTypes.STRING,
  user2: DataTypes.STRING,
  owe: DataTypes.DECIMAL,
  clear: DataTypes.BOOLEAN,
}, {
  tableName: 'balance',
  timestamps: false,
});

// Balance.belongsTo(User, {
//   foreignKey: 'user1',
//   as: 'U1',
// });

// Balance.belongsTo(User, {
//   foreignKey: 'user2',
//   as: 'U2',
// });

module.exports = {
  sequelize, User, Group, Invite, Balance, Expense,
};
