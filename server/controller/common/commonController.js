import handleError from "../../exceptions/error-handler.js";
import * as CommonServices from "../../services/commonServices.js";
import { CustomError } from "../../exceptions/CustomError.js";
import { verifyRefreshToken } from "../../helpers/jwt_helper.js";
import redisClient from "../../helpers/init_redis.js";

const signIn = async (req, res) => {
  /* FLOW
  1. 받은 구글토큰이 제대로된 토큰인지 구글서버에서 확인한다.
  2. 새로운 사용자로 등록한다.
  3. 새로운 사용자의 정보를 담은 액세스토큰과 리플레쉬토큰을 생성한다.
  4. 클라이언트로 새로운 사용자의 정보와 토큰들을 보내준다.
   */
  try {
    const result = await CommonServices.verifyGoogleToken(req);
    const newUser = await CommonServices.createUser(result);
    const {accessToken, refreshToken} = await CommonServices.generateToken(newUser);
    res.status(200).json({newUser, token: {accessToken, refreshToken}});
  } catch (error) {
    handleError(res, error);
  }
};

const login = async (req, res) => {
  /* FLOW
  1. 받은 구글토큰이 제대로된 토큰인지 구글서버에서 확인한다.
  2. 받은 구글토큰의 정보로 사용자를 찾아낸다.
  3. 사용자의 정보를 담은 액세스토큰과 리플레쉬토큰을 생성한다.
  4. 클라이언트로 사용자의 정보와 토큰들을 보내준다.
 */
  try {
    const result = await CommonServices.verifyGoogleToken(req);
    const user = await CommonServices.findUser(result.email);
    if (user === null) {
      throw new CustomError(400, "존재하지 않는 사용자입니다.");
    }
    const {accessToken, refreshToken} = await CommonServices.generateToken(user);
    res.status(200).json({user, token: {accessToken, refreshToken}});
  } catch (error) {
    handleError(res, error);
  }


  async function findItem() {
    try {
      const result1 = await goToStore1();
      if (result1 === null) await goToStore2();
      if (result2 === null) await goToStore2();
    } catch (error) {
      console.log(error)
    }
  }


};

const refreshToken = async (req, res) => {
  /* FLOW
  1. 받은 리플레쉬토큰 검증 => 토큰을 까서 사용자 정보 리턴
  2. 새로운 액세스토큰, 리플레쉬토큰 생성
  3. 클라이언트로 사용자의 정보와 토큰들을 보내준다.
  */
  try {
    //   1. 받은 리플레쉬 토큰 검증 => 안에 있는 정보를 리턴한다.
    const {refreshToken} = req.body;
    const userPayload = await verifyRefreshToken(refreshToken);
    //   2. 새로운 액세스토큰, 리플레쉬토큰 생성
    const {accessToken, refreshToken: newRefreshToken} = await CommonServices.generateToken(userPayload);

    // res.send({accessToken: accessToken, refreshToken: newRefreshToken});
    res.send(payload);
  } catch (error) {
    console.log(error);
    handleError(res, error);
  }
};

export { signIn, login, refreshToken };
