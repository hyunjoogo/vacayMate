const express = require('express');
const router = express.Router();
const {OAuth2Client} = require('google-auth-library');
const User = require('../models/User');
const jwt = require("jsonwebtoken");


// 구글 OAuth2.0을 이용한 사용자 등록 API
router.post('/', async (req, res, next) => {
  // ----------------------------- 임시 컬렉션 삭제
  // User.collection.drop();
  //  -------------------------- 임시 컬렉션 삭제

  const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_PASSWORD);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }


  try {
    const token = authHeader.split(' ')[1];
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    let user = await User.findOne({email: email});
    if (!user) {
      user = new User({
        email: email,
        name: payload.name,
        profileImage: payload.picture,
        leaveTypes: []
      });
      await user.save();
      console.log("새로운 사용자입니다. 계정을 생성합니다")
    } else {
      console.log("기존사용자입니다. 기존사용자의 정보를 보냅니다.")
    }
    const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.status(200).json({accessToken});
  } catch (error) {
    console.error(error);
    res.status(401).send('Google OAuth2.0 인증에 실패했습니다.');
  }
});

module.exports = router;
