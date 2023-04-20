import { CustomError } from "../exceptions/CustomError.js";
import { OAuth2Client } from "google-auth-library";
import { db } from "../models/index.js";

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_PASSWORD);

// 클라이언트에서 전송한 JWT(JSON Web Token)를 구글 OAuth2 클라이언트 라이브러리(google-auth-library)를 사용하여 검증합니다.
// 이를 통해, JWT가 유효한지 확인하고, JWT에 포함된 사용자 정보를 추출합니다.
const verifyGoogleToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new CustomError(401, "구글 토큰에 문제가 발생했습니다.",);
  }
  const token = authHeader.split(' ')[1];
  // JWT를 구글 서버로 보내 검증을 요청하는 기능을 수행
  // audience 매개변수에는, 해당 JWT를 생성한 클라이언트 ID를 전달합니다.
  // 이를 통해, JWT가 해당 클라이언트에서 생성된 것인지 확인합니다.
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (payload) {
    req.userId = payload['sub'];
    console.log(payload);
  }

  return payload;
};

const createUser = async (googleInfo) => {
  // const emaila = "hyunjoogo@tuneit.io";
  const isExist = await db.User.findOne({
    where: {
      email: googleInfo.email
    }
  });
  if (isExist !== null) {
    throw new CustomError(400, "이미 존재하는 사용자입니다.");
  }
  const newUser = await db.User.create({
    name: googleInfo.name,
    email: googleInfo.email,
    // 사진?
  });

  return newUser;
};

const generateToken = async (user) => {
  // const accessToken = await signAccessToken(user.id)
  // const refreshToken = await signRefreshToken(user.id)

  const accessToken = "accessToken";
  const refreshToken = "refreshToken";

  return {accessToken, refreshToken};

};

export { verifyGoogleToken, createUser, generateToken };
