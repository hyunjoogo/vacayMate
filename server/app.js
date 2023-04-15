import * as dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import { db } from "./models/index.js";
import RegisterRouter from "./routes/register.js";
import UserRouter from './routes/user/index.js'
import AdminRouter from './routes/admin/index.js'
import isUser from "./middlewares/isUser.js";


db.sequelize.sync();

const app = express();
const PORT = 3300;

// db.sequelize.sync(); //sync 메서드를 사용하면 알아서 MySQL과 연동됨

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// router 정의
// 세그먼트(:ver)는 미들웨어에서 같은 줄에 있는 애들만 인식한다. (isUser가 Route로 들어가면 :ver를 인식못함)
app.use('/api/register/:ver', RegisterRouter);
app.use('/api/user/:ver', isUser, UserRouter);
app.use('/api/admin/:ver', AdminRouter);

app.listen(PORT, () => console.log(`서버 시작됨: http://localhost:${PORT}`));


