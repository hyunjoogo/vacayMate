import Cookies from "js-cookie";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
} from "../Consts/consts";

interface TokenInterface {
  accessToken: string;
  refreshToken: string;
}

export function setAuthorizations({
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

export function getRefreshToken() {
  return Cookies.get("refresh_token");
}

export function getAccessToken() {
  return Cookies.get("access_token");
}

export function setAccessToken(accessToken: string) {
  Cookies.set("access_token", accessToken, {
    expires: ACCESS_TOKEN_EXPIRE_TIME,
    secure: true,
    sameSite: "strict",
  });
}
