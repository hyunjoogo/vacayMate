const handleError = require("../../exceptions/error-handler");
const {User, Vacation, Request} = require("../../models");
const {ROLE_TYPE} = require("../../const/admin");
const {Sequelize} = require("sequelize");
const membersServices = require('../../services/membersServices');

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
    const memberDetail = await User.findByPk(memberNo);
    // 대상 회원의 휴가종류 가지고 와서 유형별 remain/total 넘겨주기
    const memberVacations = await Vacation.findAll({
      where: {user_id: memberNo}
    });
    // 대상 회원의 요청 가지고 와서 상태별 갯수 넘겨주기
    const memberRequests = await Request.findAll({
      where: {user_id: memberNo}
    });

    res.status(200).json({memberDetail, memberVacations, memberRequests});
  } catch (error) {
    handleError(res, error);
  }
};
