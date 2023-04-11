const {DataTypes} = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const VacationType = require('./vacation-type');

const UserVacation = sequelize.define('UserVacation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    field: 'user_id'

  },
  vacationTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: VacationType,
      key: 'id'
    },
    field: 'vacation_type_id'
  },
  remainingDays: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'remaining_days'
  },
  totalDays: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'total_days'
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expiration_date'
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

// UserVacation 모델과 VacationType 모델은 N:1 관계입니다.
// 여러 개의 UserVacation이 하나의 VacationType 속할 수 있습니다.
// UserVacation.belongsTo(User, { foreignKey: 'userId' });
UserVacation.belongsTo(VacationType, { foreignKey: 'vacationTypeId' });



UserVacation.sync({force: false})
.then(() => {
  console.log('UserVacation model and database table synced successfully!');
})
.catch(error => {
  console.error('Unable to sync UserVacation model and database table:', error);
});


module.exports = UserVacation;
