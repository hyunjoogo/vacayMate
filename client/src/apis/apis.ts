import axios from "axios";
import { RequestFormat } from "../pages/request/RequestPage";
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

export const postRequests = (request: RequestFormat) => {
  const url = baseUrl + "/api/user/v1/request";
  const accessToken = getAccessToken();
  return axios.post(url, request, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getMemberRequests = (params: {}) => {
  const url = baseUrl + "/api/admin/v1/request";
  const accessToken = getAccessToken();
  return axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      ...params,
    },
  });
};
