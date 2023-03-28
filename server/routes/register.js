const express = require('express');
const router = express.Router();
const {OAuth2Client} = require('google-auth-library');
const User = require('../models/User');
const jwt = require("jsonwebtoken");


// 구글 OAuth2.0을 이용한 사용자 등록 API
router.post('/google', async (req, res, next) => {
  const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_PASSWORD);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    let user = await User.findOne({email: email});
    if (!user) {
      user = new User({
        email: email,
        name: payload.name,
        profileImage: payload.picture,
        leaveTypes: [],
      });
      await user.save();
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({token: token});
  } catch (error) {
    console.error(error);
    res.status(401).send('Google OAuth2.0 인증에 실패했습니다.');
  }
});

// email로 사용자 등록
router.post('/email', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  // email과 password가 존재하지 않으면 400 에러 반환
  if (!email || !password || !name) {
    return res.status(400).send({error: 'Email and password are required.'});
  }

  try {
    // email이 이미 존재하는지 확인
    const existingUser = await User.findOne({email: email});
    if (existingUser) {
      return res.status(400).send({error: 'Email is already in use.'});
    }

    // 새로운 사용자 생성
    const user = new User({email, password, name});
    // TODO 비밀번호 해싱해서 저장하기
    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);

    // 응답 반환
    res.send({user: user, token: token});
  } catch (err) {
    console.log(err);
    res.status(500).send({error: 'Server error occurred.'});
  }
});


module.exports = router;
