import { db } from "../models/index.js";


const isUser = async (req, res, next) => {
  // TODO 토큰에서 userId 가지고 오기
  // 토큰의 userId 대신 :ver 세그먼트 값을 userId로 사용
  // 토큰에서 가지고 오는 테스트 끝나면 꼭 삭제하고 :ver 세크먼트는 'v1', 'v2' 같은 버젼용도로 사용할 것
  const userId = Number(req.params.ver);
  const user = await db.User.findByPk(userId);
  console.log(`User ID: ${userId}`, `Name: ${user.name}`, `isAdmin: ${user.role === 'admin'}`);

  if (!user) {
    res.status(400).json({success: false, message: '존재하지 않는 사용자입니다.'});
    return;
  }
  req.user = user; // 요청 객체에 사용자 정보를 추가합니다.
  next();
};

export default isUser;
