import { db } from "../models/index.js";
// 사용자의 모든 휴가유형을 찾는다.
const getMembersListPagination = async (options) => {
  const {count, rows} = await db.User.findAndCountAll(options);
  return {count, rows};
};

const getMemberByPK = async (memberNo) => {
  const member = await db.User.findByPk(memberNo);
  return member
};

export { getMembersListPagination, getMemberByPK }
