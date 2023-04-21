import handleError from "../../exceptions/error-handler.js";
import * as CommonServices from "../../services/commonServices.js";
import { CustomError } from "../../exceptions/CustomError.js";
import { verifyRefreshToken } from "../../helpers/jwt_helper.js";

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
};

const refreshToken = async (req, res) => {
  /* FLOW
  1. 받은 리플레쉬토큰이 문제 있는지 확인하고 안에 있는 정보를 리턴한다.
  2. 사용자의 정보를 담은 액세스토큰과 리플레쉬토큰을 생성한다.
  3. 클라이언트로 사용자의 정보와 토큰들을 보내준다.
  */
  try {
    const {refreshToken} = req.body;

    const userId = await verifyRefreshToken(refreshToken);

    const {accessToken, refreshToken: newRefreshToken} = await CommonServices.generateToken(newUser);

    res.send({accessToken: accessToken, refreshToken: newRefreshToken});
  } catch (error) {
    handleError(res, error);
  }
};

export { signIn, login };
