import { OAuth2Client } from "google-auth-library";
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_PASSWORD
);

const verifyGoogleToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res
      .status(400)
      .json({ success: false, message: "구글 토큰에 문제가 발생했습니다." });
  }
  const token = authHeader.split(" ")[1];

  const ticket = await oAuth2Client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload(); //
  if (payload) {
    req.userId = payload["sub"];
    req.user = payload;
    // console.log('구글토큰 내부 Payload', payload);
  }
  next();
};
export default verifyGoogleToken;
