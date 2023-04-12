require('dotenv').config();
const env = process.env;

const development = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_HOST,
  "port": env.DB_PORT,
  "dialect": "mysql"
};

const production = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_HOST,
  "port": env.DB_PORT,
  "dialect": "mysql"
};

const test = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_HOST,
  "port": env.DB_PORT,
  "dialect": "mysql"
};

module.exports = { development, production, test };
