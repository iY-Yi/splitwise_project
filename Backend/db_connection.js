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

module.exports = { sequelize, User };
