import * as RequestStatus from "../const/request-status.js";

export default (sequelize, DataTypes) => {
  const Request = sequelize.define(
    "Request",
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
      vacation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Vacations",
          key: "id",
        },
      },
      use_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      using_type: {
        type: DataTypes.STRING, // 일차, 오전반차, 오후반차
        allowNull: false,
      },
      using_day: {
        type: DataTypes.FLOAT, // 1, 0.5
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING, // 대기중, 승인, 취소, 거절, 사용완료
        allowNull: false,
        defaultValue: RequestStatus.PENDING,
      },
      memo: {
        type: DataTypes.TEXT,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      approved_memo: {
        type: DataTypes.TEXT,
      },
      refused_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      refused_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      refused_memo: {
        type: DataTypes.TEXT,
      },
      canceled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      canceled_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      canceled_memo: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );

  return Request;
};
