import jwt from "jsonwebtoken";
import { CustomError } from "../exceptions/CustomError.js";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ISSUER,
  PAYLOAD,
  REFRESH_TOKEN_EXPIRE_TIME,
} from "../const/tokenConfig.js";
import { db } from "../models/index.js";
import dayjs from "dayjs";

// 새로운 accessToken을 생성하는 함수
const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = PAYLOAD(user);
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
      issuer: ISSUER,
      audience: String(user.id),
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve(token);
    });
  });
};

// 클라이언트로부터 들어온 token을 검증
const verifyAccessToken = async (accessToken) => {
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return payload;
  } catch (error) {
    const message =
      error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;
    throw new CustomError(401, message);
  }
};

// 외부로부터 받은 user 객체를 이용하여 새로운 RefreshToken을 생성 후
// Redis에 key가 user의 id인 RefreshToken을 저장
const signRefreshToken = async (user) => {
  try {
    const payload = PAYLOAD(user);
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
      issuer: ISSUER,
      audience: String(user.id),
    };
    /*
    코드1 : const refreshToken = await jwt.sign(payload, secret, options);
    return refreshToken;
    코드2 :return await jwt.sign(payload, secret, options)
    코드1과 코드2는 같은 결과를 가지고 온다.
    하지만 await를 바로 리턴하지 않고 변수로 할당하여 리턴(코드1)하는 이유는
    await가 리턴하는 값에 대한 예외처리가 필요할 때 (에러 핸들링이 아님) 바로 사용이 가능하기 때문
     */
    const refreshToken = await jwt.sign(payload, secret, options);
    return refreshToken;
  } catch (error) {
    console.log(error);
    throw new CustomError(401, error.message);
  }
};

// Redis에 저장되어 있는 Refresh Token이 클라이언트에서 보낸 Refresh Token과 같은지 확인한다.
const verifyRefreshToken = async (refreshToken) => {
  let userId = "";

  try {
    // Refresh Token 검증
    const userPayload = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // 서버토큰 값과 같은지 검증
    userId = userPayload.id;
    const serverRefreshToken = await db.Token.findOne({
      where: {
        userId,
      },
    });

    if (serverRefreshToken === null) {
      throw new Error("사용자의 토큰이 없습니다.");
    }

    // 서버의 토큰이 현재시간 기준으로 유효시간이 지났는지?
    if (serverRefreshToken.expires_in < dayjs().unix()) {
      throw new Error("만료가 된 Token입니다.");
    }
    // 서버의 토큰과 클라의 토큰이 같은지 확인
    if (serverRefreshToken.tokenValue !== refreshToken) {
      throw new Error("Redis의 값과 Refresh Token이 다릅니다.");
    }
    return userPayload;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // user_id를 알 수가 없으므로 클라이언트로 오류 메시지를 로그인을 다시하여 레디스를 다시 저장하게 해야한다.
      throw new CustomError(401, "만료가 된 토큰입니다.");
    }
    throw new CustomError(401, error.message);
  }
};

export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
