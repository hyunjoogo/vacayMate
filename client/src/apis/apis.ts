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

export const getMemberRequests = (params: {}, nowPage: number) => {
  const url = baseUrl + "/api/admin/v1/request";
  const accessToken = getAccessToken();
  return axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      ...params,
      nowPage,
    },
  });
};

export const getMemberRequestDetail = (requestId: number) => {
  const url = baseUrl + "/api/admin/v1/request" + "/" + requestId;
  const accessToken = getAccessToken();
  return axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const postApproveRequest = (
  requestId: number,
  message: string | null = null
) => {
  const url = baseUrl + "/api/admin/v1/request/approve" + "/" + requestId;
  const accessToken = getAccessToken();
  return axios.post(
    url,
    {
      message,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const postRefuseRequest = (
  requestId: number,
  message: string | null = null
) => {
  const url = baseUrl + "/api/admin/v1/request/refuse" + "/" + requestId;
  const accessToken = getAccessToken();
  return axios.post(
    url,
    {
      message,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
// 관리자 - 회원목록
export const getMembersList = (params: {}, nowPage: number) => {
  const url = baseUrl + "/api/admin/v1/members";
  const accessToken = getAccessToken();
  return axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      ...params,
      nowPage,
    },
  });
};
