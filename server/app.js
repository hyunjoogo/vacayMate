const express = require("express");
const morgan = require("morgan");

require('dotenv').config();
require('./helpers/init_mongodb');

const RegisterRoute = require('./routes/register');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
  res.send('Hello from express');
});

app.use('/register', RegisterRoute)

const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
