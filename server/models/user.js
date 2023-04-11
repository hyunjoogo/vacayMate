const {DataTypes} = require('sequelize');
const sequelize = require('../database');
const UserVacation = require('./user-vacation');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  position: {
    type: DataTypes.STRING
    // allowNull: false,
  },
  department: {
    type: DataTypes.STRING
    // allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  enterDate: {
    type: DataTypes.DATE,
    field: 'enter_date'
  },
  isLeave: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_leave'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  timestamps: true,      // 1. timestamps 자동 생성 기능 설정
  underscored: true // 2. underscored 옵션을 설정
});

User.hasMany(UserVacation, { foreignKey: 'user_Id' });


User.sync({force: false})
.then(() => {
  console.log('User model and database table synced successfully!');
})
.catch(error => {
  console.error('Unable to sync User model and database table:', error);
});

module.exports = User;
