const VacationRequest = require('../../models/vacation-request');
const {Sequelize} = require("sequelize");

async function generateVacationRequests(useTimes, userId, vacationTypeId) {
  let isWrong = false;
  let vacationRequests = [];

  for (const {startDt, endDt, useType, totalCount} of useTimes) {
    const overlaps = await VacationRequest.findOne({
      where: {
        userId: userId,
        status: {
          [Sequelize.Op.or]: ['approved', 'pending']
        },
        [Sequelize.Op.or]: [
          {
            vacationStartDate: {
              [Sequelize.Op.between]: [startDt, endDt]
            }
          },
          {
            vacationEndDate: {
              [Sequelize.Op.between]: [startDt, endDt]
            }
          },
          {
            [Sequelize.Op.and]: [
              {
                vacationStartDate: {
                  [Sequelize.Op.lt]: startDt
                }
              },
              {
                vacationEndDate: {
                  [Sequelize.Op.gt]: endDt
                }
              }
            ]
          }
        ]
      }
    });

    if (overlaps) {
      isWrong = true;
      break;
    }

    // 겹치는 기간이 없으므로 양식에 맞게
    const newVacationRequest = {
      userId,
      vacationTypeId,
      vacationStartDate: startDt,
      vacationEndDate: endDt,
      vacationTimeType: useType,
      totalVacationDays: totalCount,
      status: 'pending',
    };
    vacationRequests.push(newVacationRequest);
  }


  return {isWrong, vacationRequests};
}

module.exports = generateVacationRequests;

