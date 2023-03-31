const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

require('dotenv').config();
require('./helpers/init_mongodb');

const RegisterRoute = require('./routes/register');
const LoginRoute = require('./routes/login');
const VacationRoute = require('./routes/vacation');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
  res.send('Hello from express');
});

app.use('/login', LoginRoute);
app.use('/register', RegisterRoute)
app.use('/vacation', VacationRoute)

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
