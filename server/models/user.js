module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    position: {
      type: DataTypes.STRING
      // allowNull: false,
    },
    department: {
      type: DataTypes.STRING
      // allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
    enter_date: {
      type: DataTypes.DATEONLY
    },
    is_leave: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false, charset: "utf8", collate: "utf8_general_ci"
  });

  return User;
};


