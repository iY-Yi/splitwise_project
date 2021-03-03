const Sequelize = require('sequelize');
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

module.exports = {
  sequelize, User, Group, GroupUser,
};
