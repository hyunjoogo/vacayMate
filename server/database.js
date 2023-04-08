const {Sequelize} = require('sequelize');


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  // timezone: "Asia/Seoul",
  // dialectOptions: {
  //   charset: "utf8mb4",
  //   dateStrings: true,
  //   typeCast: true,
  // },
  define: {
    timestamps: false,
    underscored: true,
  },
});

module.exports = sequelize;


// 타임존 관련
// https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=varkiry05&logNo=221580851696
