const mongoose = require('mongoose');
const { Schema } = mongoose;

const { mongoDB } = require('./Utils/config');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 20,
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

const noteSchema = new Schema({
  comment: { type: String },
  userId: { type: Schema.ObjectId },
  userName: { type: String },
  date: { type: Date, default: Date.now },
});

const expenseSchema = new Schema({
  group: { type: Schema.ObjectId, ref: 'group' },
  payor: { type: Schema.ObjectId, ref: 'user' },
  description: { type: String },
  date: { type: Date, default: Date.now },
  amount: { type: Number },
  notes: [noteSchema],
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

module.exports = {
  User, Group, Balance, Expense,
};
