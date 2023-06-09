export const token = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      token_value: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      expires_in: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Token;
};
