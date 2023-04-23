import express from "express";
import * as CommonController from "../../controller/common/commonController.js";
import verifyGoogleToken from "../../middlewares/verifyGoogleToken.js";

const CommonRouter = express.Router();

CommonRouter.post('/sign-in', verifyGoogleToken, CommonController.signIn)
CommonRouter.post('/login', verifyGoogleToken, CommonController.login)
CommonRouter.post('/refresh-token', CommonController.refreshToken)



export default CommonRouter;
