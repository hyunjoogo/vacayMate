const {DataTypes} = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const VacationType = require('./vacation-type');

const VacationRequest = sequelize.define('VacationRequest', {
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
  vacationStartDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'vacation_start_date'
  },
  vacationEndDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'vacation_end_date'
  },
  vacationTimeType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'vacation_time_type'
  },
  totalVacationDays: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'total_vacation_days',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  canceledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'canceled_at'
  },
  canceledBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    },
    field: 'canceled_by'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at'
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    },
    field: 'approved_by'
  },
  refusedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'refused_at'
  },
  refusedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    },
    field: 'refused_by'
  }
}, {
  tableName: 'vacation_requests',
  timestamps: true,      // 1. timestamps 자동 생성 기능 설정
  underscored: true // 2. underscored 옵션을 설정
});

VacationRequest.belongsTo(User, { foreignKey: 'userId' });

VacationRequest.sync({ force: false })
.then(() => {
  console.log('VacationRequest model and database table synced successfully!');
})
.catch(error => {
  console.error('Unable to sync User VacationRequest and database table:', error);
});

module.exports = VacationRequest;
