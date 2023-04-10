const {DataTypes} = require('sequelize');
const sequelize = require('../database');
const UserVacation = require('./user-vacation');


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
  // 귀속분 : 어떤식으로 사용자에게 입력을 받아야하는지 생각해보자.
  // accruedExpenses: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  //   field: 'accrued_expenses'
  // },
  expirationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'expiration_date'
  },
  memo: {
    type: DataTypes.TEXT
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

// VacationType 모델과 UserVacation 모델은 1:N 관계입니다.
// 하나의 VacationType 여러 개의 UserVacation을 가질 수 있습니다.
VacationType.hasMany(UserVacation, {foreignKey: 'vacationTypeId'});

VacationType.prototype.hasEnoughRemainingDays = async function (requestedDays) {
  const remainingDays = this.remaining_days;
  if (remainingDays < requestedDays) {
    throw new Error('Not enough remaining days');
  }
};

VacationType.prototype.decreaseRemainingDays = async function (requestedDays) {
  await this.hasEnoughRemainingDays(requestedDays);

  const remainingDays = this.remaining_days - requestedDays;
  this.remaining_days = remainingDays;
  await this.save();
};

VacationType.sync({force: false})
.then(() => {
  console.log('VacationType model and database table synced successfully!');
})
.catch(error => {
  console.error('Unable to sync User VacationType and database table:', error);
});

module.exports = VacationType;
