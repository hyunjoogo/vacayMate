const VacationRequest = require("../models/vacation-request");
const User = require("../models/user");
const VacationType = require("../models/vacation-type");
const Sequelize = require("sequelize");

exports.getMyRequestDetail = async (vacationRequestId) => {
  const vacationRequest = await VacationRequest.findOne({
    where: {id: vacationRequestId},
    include: [
      {
        model: User,
        attributes: ['id', 'name']
      },
      {
        model: VacationType, // VacationType 모델 추가
        attributes: ['id', 'name'] // 필요한 속성만 선택
      },
      {
        model: User,
        as: 'approvedByUser',
        attributes: ['id', 'name'],
        where: {id: Sequelize.col('VacationRequest.approved_by')},
        required: false
      },
      {
        model: User,
        as: 'canceledByUser',
        attributes: ['id', 'name'],
        where: {id: Sequelize.col('VacationRequest.canceled_by')},
        required: false
      },
      {
        model: User,
        as: 'refusedByUser',
        attributes: ['id', 'name'],
        where: {id: Sequelize.col('VacationRequest.refused_by')},
        required: false
      }
    ]
  });
  const result = {};


  return result;
};
