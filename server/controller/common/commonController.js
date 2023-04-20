import handleError from "../../exceptions/error-handler.js";
import * as CommonServices from "../../services/commonServices.js";


const signIn = async (req, res) => {
  try {
    const result = await CommonServices.verifyGoogleToken(req);
    const newUser = await CommonServices.createUser(result);
    const {accessToken, refreshToken} = await CommonServices.generateToken(newUser);
    res.status(200).json(newUser);
  } catch (error) {
    handleError(res, error);
  }
};

export { signIn };
