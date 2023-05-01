import Cookies from "js-cookie";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
} from "../Consts/consts";

interface TokenInterface {
  accessToken: string;
  refreshToken: string;
}

export function setAuthorization({
  accessToken,
  refreshToken,
}: TokenInterface) {
  Cookies.set("access_token", accessToken, {
    expires: ACCESS_TOKEN_EXPIRE_TIME,
    secure: true,
    sameSite: "strict",
  });
  Cookies.set("refresh_token", refreshToken, {
    expires: REFRESH_TOKEN_EXPIRE_TIME,
    secure: true,
    sameSite: "strict",
  });
}
