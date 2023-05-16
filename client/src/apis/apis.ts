import axios from "axios";
import { getAccessToken } from "../utils/CookieUtil";

const baseUrl = "http://localhost:3300";

export const getMemberVacations = () => {
  const url = baseUrl + "/api/user/v1/vacation";
  const accessToken = getAccessToken();
  return axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
