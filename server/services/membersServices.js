const {User} = require("../models");

// 사용자의 모든 휴가유형을 찾는다.
exports.getMembersListPagination = async (options) => {
  const {count, rows} = await User.findAndCountAll(options);
  return {count, rows};
};

exports.getMemberByPK = async (memberNo) => {
  const member = await User.findByPk(memberNo);
  return member
};
