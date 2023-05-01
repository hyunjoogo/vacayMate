import { createContext, ReactNode, useEffect } from "react";
import { userContextAtom } from "../atom/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import * as CookieUtils from "../utils/CookieUtil";
import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  setAuthorizations,
} from "../utils/CookieUtil";

interface UserContextValue {
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

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [userContext, setUserContext] = useRecoilState(userContextAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const refreshToken = CookieUtils.getRefreshToken();
  const accessToken = CookieUtils.getAccessToken();

  useEffect(() => {
    console.log(location.pathname, userContext);
    const isLoginPage = location.pathname === "/login";
    const isEmptyUserContext = Object.keys(userContext).length === 0;
    console.log(isLoginPage, isEmptyUserContext);
    console.log(accessToken, refreshToken);

    if (isLoginPage) {
      return;
    }
    // accessToken 과 refreshToken이 있으면
    if (accessToken && refreshToken) {
      return;
    }
    // refreshToken만 있으면
    if (accessToken === undefined && refreshToken) {
      tokenLogin(refreshToken);
    } else {
      // 둘 다 없으면
      alert("로그인이 필요합니다.");
      navigate("/login", { replace: true });
    }
  }, [location.pathname]);

  const tokenLogin = async (refreshToken: string) => {
    console.log("토큰 로그인을 시도합니다.");
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
      // navigate("/", { replace: true });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};
