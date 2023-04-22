import jwt from 'jsonwebtoken';
import redisClient from './init_redis.js';
import { CustomError } from "../exceptions/CustomError.js";

const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1h',
      issuer: 'Vacay-Mate',
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

const verifyAccessToken = async (token) => {
  // if (!req.headers['authorization']) return next(createError.Unauthorized())
  // const authHeader = req.headers['authorization']
  // const bearerToken = authHeader.split(' ')
  // const token = bearerToken[1]
  // JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
  //   if (err) {
  //     const message =
  //       err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
  //     return next(createError.Unauthorized(message))
  //   }
  //   req.payload = payload
  //   next()
  // })
};

// 외부로부터 받은 user 객체를 이용하여 새로운 RefreshToken을 생성 후
// Redis에 key가 user의 id인 RefreshToken을 저장
const signRefreshToken = async (user) => {
  try {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
      issuer: 'Vacay-Mate',
      audience: String(user.id),
    };

    const refreshToken = await jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error(err);
        throw new Error('JWT 토큰 생성 과정에서 오류가 발생했습니다.');
      }
      console.log('내부', token);
      return token;
    });

    console.log(refreshToken);

    return refreshToken;
  } catch (error) {
    throw new CustomError('401', error.message);
  }
};

// Redis에 저장되어 있는 Refresh Token이 클라이언트에서 보낸 Refresh Token과 같은지 확인한다.
const verifyRefreshToken = async (refreshToken) => {
  try {
    // Refresh Token 검증
    const userPayload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, contents) => {
      if (err) {
        console.error(err);
        throw new Error('RefreshToken 변조 의심');
      }
      return contents;
    });
    // Redis에 저장된 데이터 중 사용자의 id를 키로 가지고 있는 값과 같은지 검증
    const userId = userPayload.id;
    const redisRefreshToken = await redisClient.get(String(userId), (err, result) => {
      if (err) {
        console.error(err);
        throw new Error('Redis에 정보가 없습니다.');
      }
      return result;
    });
    if (redisRefreshToken !== refreshToken) throw new Error("Redis의 값과 Refresh Token이 다릅니다.");

    return userPayload;
  } catch (error) {
    throw new CustomError('401', error.message);
  }
};


export { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken };

