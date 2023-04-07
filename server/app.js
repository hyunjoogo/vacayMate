const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const verifyToken = require("./middlewares/verifyToken");
const AuthRoute = require("./routes/auth");
const VacationRoute = require("./routes/vacation");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/api/auth", AuthRoute);
app.use("/api/vacation", VacationRoute);


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message
  });
});

const PORT = 3300;
app.listen(PORT, () => console.log(`서버 시작됨: http://localhost:${PORT}`));
