const express = require("express");
const dotenv = require('dotenv');
const morgan = require("morgan");
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));


const PORT = 3300;



app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
