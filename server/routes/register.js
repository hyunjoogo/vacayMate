const express = require('express');
const handleError = require("../exceptions/error-handler");
const {User} = require("../models");
const isUser = require("../middlewares/isUser");
const router = express.Router();

router.get('/', isUser, async (req, res) => {
  try {
    res.status(200).json({});
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/', isUser, async (req, res) => {
  const {name, email} = req.body;
  try {
    const user = await User.findOne({
      where: {email}
    });
    if (user !== null) {
      return res.status(400).json({message: "이미 가입된 사용자입니다."});
    }
    const newUser = await User.create({name, email});
    res.status(200).json(newUser);
  } catch (error) {
    handleError(res, error);
  }
});


module.exports = router;