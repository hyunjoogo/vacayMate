const UserVacation = require('../../models/user-vacation');
const VacationType = require('../../models/vacation-type');
const User = require("../../models/user");

exports.getMyVacations = async (userId) => {
  const myVacations = await UserVacation.findAll({
    where: {userId},
    include: [
      {
        model: VacationType,
        as: 'vacationType',
        attributes: ['name']
      }
    ]
  });

  return myVacations;
};
