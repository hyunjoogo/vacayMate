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
        as: 'user',
        attributes: ['id', 'name']
      },
      {
        model: VacationType, // VacationType 모델 추가
        as: 'vacationType',
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

  const {
    id, userId, user,
    vacationType,
    vacationStartDate,
    vacationEndDate,
    vacationTimeType,
    totalVacationDays,
    status,
    approvedByUser,
    canceledByUser,
    refusedByUser,
    approvedAt,
    canceledAt,
    refusedAt
  } = vacationRequest;

  const result = {
    id, userId,
    userName: user.name,

    vacationTypeId : vacationType.id,
    vacationTypeName : vacationType.name,

    vacationStartDate: vacationStartDate,
    vacationEndDate: vacationEndDate,
    vacationTimeType: vacationTimeType,
    totalVacationDays: totalVacationDays,

    status,
    isApproved: !!approvedByUser,
    approvedByUserName: approvedByUser ? approvedByUser.name : null,
    approvedByUserId: approvedByUser ? approvedByUser.id : null,
    approvedAt: approvedByUser ? approvedAt : null,
    isRefused: !!refusedByUser,
    refusedByUserName: refusedByUser ? refusedByUser.name : null,
    refusedByUserId: refusedByUser ? refusedByUser.id : null,
    refusedAt: refusedByUser ? refusedAt : null,
    isCanceled: !!canceledByUser,
    canceledByUserName: canceledByUser ? canceledByUser.name : null,
    canceledByUserId: canceledByUser ? canceledByUser.id : null,
    canceledAt: canceledByUser ? canceledAt : null,
  };


  return result;
};

