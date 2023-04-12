const {Sequelize} = require('sequelize');

const env = process.env.NODE_ENV || "development"; //실제 출시할 때 production로 변경.
const config = require("../config/config")[env]; //config.json 객체에서 [env] 선택

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {}; //db라는 객체를 만들고 모듈로 활용

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Vacation = require("./vacation")(sequelize, Sequelize);

db.User.hasMany(db.Vacation, {foreignKey: 'user_id'});
db.Vacation.belongsTo(db.User, { foreignKey: 'user_id' });

module.exports = db;
