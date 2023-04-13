const handleError = require("../../exceptions/error-handler");
const {User, Vacation, Request, sequelize} = require("../../models");
const {ROLE_TYPE} = require("../../const/admin");
const {Sequelize} = require("sequelize");
const membersServices = require('../../services/membersServices');
const validationError = require("../../exceptions/validation-error");
const dayjs = require('dayjs');

exports.getMembers = async (req, res) => {
  const {nowPage = 1, pageSize = 10, name, email, role, enterDate, isLeave} = req.query;
  const offset = (nowPage - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const where = {};

    if (name) {
      where.name = {
        [Sequelize.Op.like]: `%${name}%`
      };
    }
    if (email) {
      where.email = {
        [Sequelize.Op.like]: `%${email}%`
      };
    }
    if (ROLE_TYPE.includes(role)) {
      where.role = role;
    }
    if (isLeave === 'true' || isLeave === 'false') {
      where.is_leave = isLeave === 'true';
    }

    const {count, rows} = await membersServices.getMembersListPagination({
      where,
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      data: rows,
      page: {
        nowPage: Number(nowPage),
        pageSize: limit,
        totalPages: totalPages,
        totalCount: count
      }
    });

  } catch (error) {
    handleError(res, error);
  }
};

exports.getMemberDetail = async (req, res) => {
  const {memberNo} = req.params;

  try {
    // TODO Validation 생각해보기
    // TODO Service로 옮기기
    const member = await membersServices.getMemberByPK(memberNo);
    // 대상 회원의 휴가종류 가지고 와서 유형별 remain/total 넘겨주기
    const memberVacations = await Vacation.findAll({
      where: {user_id: memberNo}
    });
    // 대상 회원의 요청 가지고 와서 상태별 갯수 넘겨주기
    const memberRequests = await Request.findAll({
      where: {user_id: memberNo}
    });

    res.status(200).json({member, memberVacations, memberRequests});
  } catch (error) {
    handleError(res, error);
  }
};

exports.createEnterDate = async (req, res) => {
  const {memberNo} = req.params;
  const {enterDate} = req.body;

  const format = 'YYYY-MM-DD';

  const isValidFormat = dayjs(enterDate, format, true).format(format) === enterDate;
  const isValidDate = dayjs(enterDate, format, true).isValid();

  const transaction = await sequelize.transaction();

  try {

    // 유효하지 않은 날짜 형식일 경우
    if (isValidFormat === false || isValidDate === false) {
      return validationError(res, "잘못된 날짜형식입니다.");
    }

    const member = await membersServices.getMemberByPK(memberNo, {transaction});

    // 입사날짜가 이미 입력되어 있는 경우
    // if (member.enter_date !== null) {
    //   return validationError(res, "이미 입사날짜가 입력되어 있습니다.");
    // }

    // 입사날짜 입력하기
    const updatedMember = await member.update({enter_date: enterDate}, {transaction});

    //////// 한번 트랜젝션을 나누고


    // 회원의 휴가유형을 조회하여 연차 생성이 이미 되어 있으면 에러

    // const memberVacations = await updatedMember.getVacations({
    //   where : {type : "연차"}
    // }, {transaction});
    const memberVacations = await Vacation.findOne({
      where : {user_id : memberNo, type : "연차"}
    }, {transaction})
    if (memberVacations.length !== 0) {
      return validationError(res, "이미 생성된 연차가 존재합니다.");
    }

    // 연차 계산 후 생성하기

    // 생성된 연차 remain, total 테이블에 저장
    const memberAnnual = await updatedMember.createVacation(
      {
        type: "연차",
        memo: "...", // 메모를 받아야겠네?
        left_days: 3,
        total_days: 5,
        expiration_date: "2023-12-31"
      }, {transaction});

    // 이 사람의 만료일을 AutoAnnualCreator에게 넘겨주기

    await transaction.commit();

    res.status(200).json({memberVacations, memberAnnual});

  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};
