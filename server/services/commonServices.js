import { CustomError } from "../exceptions/CustomError.js";
import { OAuth2Client } from "google-auth-library";
import { db } from "../models/index.js";
import { signAccessToken, signRefreshToken } from "../helpers/jwt_helper.js";
import redisClient from "../helpers/init_redis.js";


const createUser = async (googleInfo) => {
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
    user_img : googleInfo.picture
  });

  return newUser;
};


const generateToken = async (user) => {
  const accessToken = await signAccessToken(user);
  const refreshToken = await signRefreshToken(user);
  await redisClient.SET(String(user.id), refreshToken, {EX: 365 * 24 * 60 * 60});

  return {accessToken, refreshToken};
};

const findUser = async (email) => {
  const user = await db.User.findOne({
    where: {
      email
    }
  });
  return user;
};

export { createUser, generateToken, findUser };
