import { Sequelize } from "sequelize";
import development from "../config/config.js";
import { user } from "./user.js";
import { vacation } from "./vacation.js";
import request from "./request.js";
import { token } from "./token.js";

const env = process.env.NODE_ENV || "development"; //실제 출시할 때 production로 변경.

const config_env = development;

const sequelize = new Sequelize(
  config_env.database,
  config_env.username,
  config_env.password,
  config_env
);

const db = {}; //db라는 객체를 만들고 모듈로 활용

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = user(sequelize, Sequelize);
db.Vacation = vacation(sequelize, Sequelize);
db.Request = request(sequelize, Sequelize);
db.Token = token(sequelize, Sequelize);

db.User.hasMany(db.Vacation, { foreignKey: "userId", as: "vacations" });
db.Vacation.belongsTo(db.User, { foreignKey: "userId", as: "vacations" });

db.Vacation.hasMany(db.Request, { foreignKey: "vacationId", as: "vacation" });
db.Request.belongsTo(db.Vacation, {
  foreignKey: "vacationId",
  as: "vacation",
});

db.User.hasMany(db.Request, { foreignKey: "userId", as: "user" });
db.Request.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.User.hasMany(db.Request, { foreignKey: "approvedBy" });
db.Request.belongsTo(db.User, { foreignKey: "approvedBy" });

db.User.hasMany(db.Request, { foreignKey: "refusedBy" });
db.Request.belongsTo(db.User, { foreignKey: "refusedBy" });

db.User.hasMany(db.Request, { foreignKey: "canceledBy" });
db.Request.belongsTo(db.User, { foreignKey: "canceledBy" });

db.User.hasMany(db.Token, { foreignKey: "userId" });
db.Token.belongsTo(db.User, { foreignKey: "userId" });

export { db };
