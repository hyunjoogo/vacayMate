export const token = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
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
      tokenValue: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      expiresIn: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      underscored: true,
    }
  );
  return Token;
};
