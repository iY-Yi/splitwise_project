const { Sequelize, DataTypes } = require('sequelize');
const config = require('./db_Config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  // pool: {
  //   max: 5, min: 0, idle: 30000,
  // },
});

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  password: Sequelize.STRING,
  phone: Sequelize.STRING,
  avatar: Sequelize.STRING,
  currency: Sequelize.STRING,
  timezone: Sequelize.STRING,
  language: Sequelize.STRING,
}, {
  tableName: 'user',
  timestamps: false,
});

const Group = sequelize.define('group', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  count: Sequelize.INTEGER,
  image: Sequelize.STRING,
}, {
  tableName: 'group',
  timestamps: false,
});

// DataTypes.BOOLEAN
const GroupUser = sequelize.define('group_user', {
  groupName: {
    type: Sequelize.STRING,
    references: {
      model: Group,
      key: 'name',
    },
  },
  userEmail: {
    type: Sequelize.STRING,
    references: {
      model: User,
      key: 'email',
    },
  },
  accepted: {
    type: Sequelize.BOOLEAN,
  },
}, {
  tableName: 'group_user',
  timestamps: false,
});

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

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
Expense.belongsTo(User, { foreignKey: 'email' });

// activity
const Activity = sequelize.define('activity', {
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
  debtor: DataTypes.STRING,
  creditor: DataTypes.STRING,
  amount: DataTypes.DECIMAL,
  clear: DataTypes.BOOLEAN,
}, {
  tableName: 'activity',
  timestamps: false,
});

module.exports = {
  sequelize, User, Group, GroupUser, Activity, Expense,
};
