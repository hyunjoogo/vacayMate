const User = require("../models/user");
const VacationType = require('../models/vacation-type');

async function syncUserDatabase() {
  await User.sync({force: true});
  console.log('All models were synchronized successfully.');
}

async function syncVacationTypeDatabase() {
  await VacationType.sync({force: true});
  console.log('All models were synchronized successfully.');
}

module.exports = {
  syncUserDatabase,
  syncVacationTypeDatabase
};

