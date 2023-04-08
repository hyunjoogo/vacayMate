const sequelize = require('../database');
const {DataTypes} = require("sequelize");

const Time = sequelize.define('Time', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  currentTime: {
    type: DataTypes.DATE
  },
  utcTime: {
    type: DataTypes.DATE
  },
  dayjsTime: {
    type: DataTypes.DATE
  },
}, {
  timestamps: true,      // 1. timestamps 자동 생성 기능 설정
  underscored: true, // 2. underscored 옵션을 설정
});

Time.sync({force: true})
.then(() => {
  console.log('User model and database table synced successfully!');
})
.catch(error => {
  console.error('Unable to sync User model and database table:', error);
});

module.exports = Time;
