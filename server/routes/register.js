import express from "express";

import { db } from "../models/index.js";
import isUser from "../middlewares/isUser.js";
import handleError from "../exceptions/error-handler.js";

const RegisterRouter = express.Router();

// FLOW
RegisterRouter.get('/', isUser, async (req, res) => {
  try {
    res.status(200).json({});
  } catch (error) {
    handleError(res, error);
  }
});

RegisterRouter.post('/', isUser, async (req, res) => {
  const {name, email} = req.body;
  try {
    const user = await db.User.findOne({
      where: {email}
    });
    if (user !== null) {
      return res.status(400).json({message: "이미 가입된 사용자입니다."});
    }
    const newUser = await db.User.create({name, email});
    res.status(200).json(newUser);
  } catch (error) {
    handleError(res, error);
  }
});

export default RegisterRouter;
