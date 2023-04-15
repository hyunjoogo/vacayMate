export const vacation = (sequelize, DataTypes) => {
  const Vacation = sequelize.define('Vacation', {
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
    type: {
      type: DataTypes.STRING, // 연차, 여름휴가, 대체휴무
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT
    },
    left_days: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    total_days: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps:false, charset: "utf8", collate: "utf8_general_ci"
  });

  return Vacation;
};
