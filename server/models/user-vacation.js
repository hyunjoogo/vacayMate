const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const UserVacation = sequelize.define('UserVacation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  remaining_days: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total_days: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = UserVacation;
