import express from "express";
import * as CommonController from "../../controller/common/commonController.js";

const CommonRouter = express.Router();

CommonRouter.post('/sign-in', CommonController.signIn)



export default CommonRouter;
