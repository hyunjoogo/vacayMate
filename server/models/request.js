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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      vacationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Vacations",
          key: "id",
        },
      },
      useDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      usingType: {
        type: DataTypes.STRING, // 일차, 오전반차, 오후반차
        allowNull: false,
      },
      usingDay: {
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      approvedMemo: {
        type: DataTypes.TEXT,
      },
      refusedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      refusedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      refusedMemo: {
        type: DataTypes.TEXT,
      },
      canceledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      canceledBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      canceledMemo: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      underscored: true,
    }
  );

  return Request;
};
