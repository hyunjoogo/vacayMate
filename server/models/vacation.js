export const vacation = (sequelize, DataTypes) => {
  const Vacation = sequelize.define(
    "Vacation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      type: {
        type: DataTypes.STRING, // 연차, 여름휴가, 대체휴무
        allowNull: false,
      },
      memo: {
        type: DataTypes.TEXT,
      },
      leftDays: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalDays: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      underscored: true,
    }
  );

  return Vacation;
};
