const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  position: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  enterDate: {
    type: DataTypes.DATE,
    // allowNull: false,
  },
  isLeave: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = User;
