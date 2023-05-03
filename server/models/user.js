export const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      position: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      enter_date: {
        type: DataTypes.DATEONLY, // 날짜 + 00:00:00Z 입력된다.
        // 그러면 입력할 때 DATE.utc()로 저장하자.
      },
      is_leave: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_img: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "default.png",
      },
      created_at: {
        allowNull: false,
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

  return User;
};
