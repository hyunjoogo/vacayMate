const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const db = require('./models/index');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const UserRoute = require('./routes/user');
const AdminRoute = require('./routes/admin');
const RegisterRoute = require('./routes/register');
const isUser = require("./middlewares/isUser");
const handleError = require("./exceptions/error-handler");

dayjs.extend(utc);

const app = express();
const PORT = 3300;

db.sequelize.sync(); //sync 메서드를 사용하면 알아서 MySQL과 연동됨

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// router 정의
// 세그먼트(:ver)는 미들웨어에서 같은 줄에 있는 애들만 인식한다. (isUser가 Route로 들어가면 :ver를 인식못함)
app.use('/api/register/:ver', RegisterRoute);
app.use('/api/user/:ver', isUser, UserRoute);
app.use('/api/admin/:ver', AdminRoute);

app.listen(PORT, () => console.log(`서버 시작됨: http://localhost:${PORT}`));


