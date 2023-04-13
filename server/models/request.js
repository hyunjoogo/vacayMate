module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    vacation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Vacations',
        key: 'id'
      }
    },
    use_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    using_type: {
      type: DataTypes.STRING, // 일차, 오전반차, 오후반차
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER, // 대기중, 승인, 취소, 거절, 사용완료
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    refused_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refused_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    canceled_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    canceled_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: false, charset: "utf8", collate: "utf8_general_ci"
  });

  return Request;
};
