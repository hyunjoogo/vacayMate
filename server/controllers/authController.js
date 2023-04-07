const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {syncUserDatabase} = require("../helpers/sync-database");

const googleLogin = async (req, res, next) => {
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
    const name = payload.name;

    await syncUserDatabase();

    let user = await User.findOne({email});
    if (!user) {
      console.log("새로운 사용자입니다. 계정을 생성합니다")
      user = await User.create({ name, email });
    } else {
      console.log("기존사용자입니다. 기존사용자의 정보를 보냅니다.")
    }
    const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    res.status(200).json({accessToken});
  } catch (error) {
    console.error(error);
    res.status(401).send('Google OAuth2.0 인증에 실패했습니다.');
  }
};

module.exports = {
  googleLogin
};
