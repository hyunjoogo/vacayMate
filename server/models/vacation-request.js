const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const VacationRequest = sequelize.define('VacationRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vacation_start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  vacation_end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  vacation_time_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  canceled_at: {
    type: DataTypes.DATE,
  },
  canceled_by: {
    type: DataTypes.INTEGER,
  },
  approved_at: {
    type: DataTypes.DATE,
  },
  approved_by: {
    type: DataTypes.INTEGER,
  },
});

module.exports = VacationRequest;
