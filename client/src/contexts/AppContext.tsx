import { createContext, ReactNode, useEffect } from "react";
import { userContextAtom } from "../atom/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import * as CookieUtils from "../utils/CookieUtil";
import { setAccessToken } from "../utils/CookieUtil";
import axios from "axios";

export interface UserContextValue {
  id?: number;
  name?: string;
  email?: string;
  position?: string | null;
  department?: string | null;
  role?: "user" | "admin";
  enter_date?: string | null;
  is_leave?: boolean;
  user_img?: string;
  created_at?: string;
}

export const useAuthentication = () => {
  const [userContext, setUserContext] = useRecoilState(userContextAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const refreshToken = CookieUtils.getRefreshToken();
  const accessToken = CookieUtils.getAccessToken();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    checkTokens();
  }, [location]);

  const checkTokens = () => {
    if (isLoginPage) {
      return;
    }
    if (accessToken && refreshToken) {
      if (Object.keys(userContext).length === 0) {
        console.log("유저정보가 없어서 토큰로그인을 시도합니다.");
        return tokenLogin(refreshToken);
      }
      return;
    }
    if (accessToken === undefined && refreshToken) {
      return tokenLogin(refreshToken);
    }
    alert("로그인이 필요합니다.");
    navigate("/login", { replace: true });
  };

  const tokenLogin = async (refreshToken: string) => {
    console.log("토큰 로그인 중.");
    try {
      const { data } = await axios.post(
        "http://localhost:3300/api/common/v1/refresh-token",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      setUserContext(data.user);
      setAccessToken(data.token.accessToken);
    } catch (err) {
      console.error(err);
    }
  };
};
