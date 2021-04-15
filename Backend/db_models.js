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
  invites: [{ type: Schema.ObjectId, ref: 'group' }],
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

const expenseSchema = new Schema({
  group: { type: Schema.ObjectId, ref: 'group' },
  payor: { type: Schema.ObjectId, ref: 'user' },
  description: { type: String },
  date: { type: Date, default: Date.now },
  amount: { type: Number },
}, {
  versionKey: false,
});
const Expense = mongoose.model('expense', expenseSchema);

const balanceSchema = new Schema({
  group: { type: Schema.ObjectId, ref: 'group' },
  description: { type: String },
  expense: { type: Schema.ObjectId, ref: 'expense' },
  date: { type: Date, default: Date.now },
  owe: { type: Number },
  user1: { type: Schema.ObjectId, ref: 'user' },
  user2: { type: Schema.ObjectId, ref: 'user' },
  clear: { type: Boolean },
}, {
  versionKey: false,
});
const Balance = mongoose.model('balance', balanceSchema);

// const Balance = sequelize.define('balance', {
//   id: {
//     type: DataTypes.UUID,
//     primaryKey: true,
//     defaultValue: Sequelize.UUIDV4,
//   },
//   group: DataTypes.STRING,
//   date: {
//     type: DataTypes.DATE,
//     defaultValue: Sequelize.NOW,
//   },
//   description: DataTypes.STRING,
//   user1: DataTypes.STRING,
//   user2: DataTypes.STRING,
//   owe: DataTypes.DECIMAL,
//   clear: DataTypes.BOOLEAN,
// }, {
//   tableName: 'balance',
//   timestamps: false,
// });

// Balance.belongsTo(User, {
//   foreignKey: 'user1',
//   as: 'U1',
// });

// Balance.belongsTo(User, {
//   foreignKey: 'user2',
//   as: 'U2',
// });

module.exports = {
  sequelize, User, Group, Balance, Expense,
};
