import { db } from "../models/index.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../helpers/jwt_helper.js";
import handleError from "../exceptions/error-handler.js";

const isUser = async (req, res, next) => {
  // 토큰의 userId 대신 :ver 세그먼트 값을 userId로 사용
  // 토큰에서 가지고 오는 테스트 끝나면 꼭 삭제하고 :ver 세크먼트는 'v1', 'v2' 같은 버젼용도로 사용할 것

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res
        .status(400)
        .json({ success: false, message: "토큰에 문제가 발생했습니다." });
    }
    const token = authHeader.split(" ")[1];
    const userPayload = await verifyAccessToken(token);
    const user = await db.User.findByPk(userPayload.id);
    console.log(
      `User ID: ${userPayload.id}`,
      `Name: ${user.name}`,
      `isAdmin: ${user.role === "admin"}`
    );

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "존재하지 않는 사용자입니다." });
      return;
    }
    req.user = user; // 요청 객체에 사용자 정보를 추가합니다.
    next();
  } catch (error) {
    console.log(error);
    handleError(res, error);
  }
};

export default isUser;
