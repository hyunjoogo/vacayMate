import React, { useEffect, useState } from "react";
import axios from "axios";
import * as CookieUtil from "../../utils/CookieUtil";
import { getMonthRange } from "../../utils/getMonthRange";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRecoilValue } from "recoil";
import { userContextAtom } from "../../atom/atoms";
import { UserContextValue } from "../../contexts/AppContext";

dayjs.extend(utc);

interface Request {
  id: number;
  userId: number;
  userName: string;
  useDate: string;
  usingType: string;
}

const HomePage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const userInfo: UserContextValue = useRecoilValue(userContextAtom);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const accessToken = CookieUtil.getAccessToken();
    // const today = now();
    const today = dayjs("2023-04-02").utc();
    const { startDt, endDt } = getMonthRange(today);
    const { data } = await axios.get(
      `http://localhost:3300/api/user/1/approved-request?startDt=${startDt}&endDt=${endDt}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(data);
    setRequests(data);
  };

  if (Object.keys(userInfo).length === 0) return null;

  return (
    <>
      {requests.map((request) => {
        return (
          <ul
            key={request.id}
            style={{
              backgroundColor:
                userInfo.id === request.userId ? "blue" : "inherit",
            }}
          >
            <li>{request.userName} </li>
            <li>
              {request.useDate} / {request.usingType}
            </li>
          </ul>
        );
      })}
    </>
  );
};

export default HomePage;
