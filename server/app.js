const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();
const AuthRoute = require("./routes/auth");



const verifyToken = require("./middlewares/verifyToken");
const {sync} = require("./database");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// sync()
// .then(() => console.log('모델과 데이터베이스 테이블 동기화 완료'))
// .catch(error => console.error('모델과 데이터베이스 테이블 동기화 실패:', error));

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});



app.use("/api/auth", AuthRoute);


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message
  });
});

const PORT = 3300;
app.listen(PORT, () => console.log(`서버 시작됨: http://localhost:${PORT}`));
