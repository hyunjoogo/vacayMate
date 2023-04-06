const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const VacationType = sequelize.define('VacationType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = VacationType;
