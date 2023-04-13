const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const db = require('./models/index');

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc');
const UserRoute = require('./routes/user')
const AdminRoute = require('./routes/admin')

dayjs.extend(utc)

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
app.use('/api/user/:ver', UserRoute)
app.use('/api/admin/:ver', AdminRoute)

app.listen(PORT, () => console.log(`서버 시작됨: http://localhost:${PORT}`));


