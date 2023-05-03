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

db.User.hasMany(db.Vacation, { foreignKey: "user_id" });
db.Vacation.belongsTo(db.User, { foreignKey: "user_id" });

db.Vacation.hasMany(db.Request, { foreignKey: "vacation_id", as: "vacation" });
db.Request.belongsTo(db.Vacation, {
  foreignKey: "vacation_id",
  as: "vacation",
});

db.User.hasMany(db.Request, { foreignKey: "user_id", as: "user" });
db.Request.belongsTo(db.User, { foreignKey: "user_id", as: "user" });

db.User.hasMany(db.Request, { foreignKey: "approved_by", as: "approvedBy" });
db.Request.belongsTo(db.User, { foreignKey: "approved_by", as: "approvedBy" });

db.User.hasMany(db.Request, { foreignKey: "refused_by", as: "refusedBy" });
db.Request.belongsTo(db.User, { foreignKey: "refused_by", as: "refusedBy" });

db.User.hasMany(db.Request, { foreignKey: "canceled_by", as: "canceledBy" });
db.Request.belongsTo(db.User, { foreignKey: "canceled_by", as: "canceledBy" });

db.User.hasMany(db.Token, { foreignKey: "user_id" });
db.Token.belongsTo(db.User, { foreignKey: "user_id" });

export { db };
