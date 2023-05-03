import { CustomError } from "../exceptions/CustomError.js";
import { db } from "../models/index.js";
import { signAccessToken, signRefreshToken } from "../helpers/jwt_helper.js";
import dayjs from "dayjs";
import { REFRESH_TOKEN_EXPIRE_DAYS } from "../const/tokenConfig.js";

const createUser = async (googleInfo) => {
  const isExist = await db.User.findOne({
    where: {
      email: googleInfo.email,
    },
  });
  if (isExist !== null) {
    throw new CustomError(400, "이미 존재하는 사용자입니다.");
  }
  const newUser = await db.User.create({
    name: googleInfo.name,
    email: googleInfo.email,
    user_img: googleInfo.picture,
  });

  return newUser;
};

const generateToken = async (user) => {
  const accessToken = await signAccessToken(user);
  const refreshToken = await signRefreshToken(user);

  // 리플레시 토큰을 SQL에 저장하는 로직
  const [token, created] = await db.Token.findOrCreate({
    where: { user_id: user.id },
    defaults: {
      token_value: refreshToken,
      expires_in: dayjs().add(REFRESH_TOKEN_EXPIRE_DAYS, "day").unix(),
    },
  });

  if (!created) {
    token.token_value = refreshToken;
    token.expires_in = dayjs().add(14, "day").unix();
    await token.save();
  }
  return { accessToken, refreshToken };
};

const findUser = async (email) => {
  const user = await db.User.findOne({
    where: {
      email,
    },
  });
  return user;
};

export { createUser, generateToken, findUser };
