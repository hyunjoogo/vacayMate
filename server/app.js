import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import morgan from "morgan";
import cors from 'cors';
import schedule from 'node-schedule';

dotenv.config();

import { db } from "./models/index.js";
import RegisterRouter from "./routes/register.js";
import UserRouter from './routes/user/index.js';
import AdminRouter from './routes/admin/index.js';
import CommonRouter from './routes/common/index.js';
import isUser from "./middlewares/isUser.js";
import isAdmin from "./middlewares/isAdmin.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
db.sequelize.sync();

const app = express();
const PORT = 3300;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// router 정의
// 세그먼트(:ver)는 미들웨어에서 같은 줄에 있는 애들만 인식한다. (isUser가 Route로 들어가면 :ver를 인식못함)
app.use('/api/common/:ver', CommonRouter);
app.use('/api/register/:ver', RegisterRouter);
app.use('/api/user/:ver', isUser, UserRouter);
app.use('/api/admin/:ver', isAdmin, AdminRouter);


const job = schedule.scheduleJob('10 * * * * *', () => console.log('a'));

app.listen(PORT, () => console.log(`서버 시작됨: http://localhost:${PORT}`));


