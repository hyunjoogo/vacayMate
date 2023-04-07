const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const VacationType = sequelize.define('VacationType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  memo: {
    type: DataTypes.TEXT
  },
});

module.exports = VacationType;
