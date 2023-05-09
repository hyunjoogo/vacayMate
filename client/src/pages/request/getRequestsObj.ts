import { Request, UsingTypes } from "./RequestPage";
import dayjs from "dayjs";

export interface RequestsObj {
  [date: string]: UsingTypes[];
}

export const getRequestsObj = (requests: Request[]) => {
  const requestsObj: RequestsObj = {};

  if (requests.length !== 0) {
    requests.forEach((request) => {
      if (request.startDt === request.endDt) {
        // request.startDt가 존재하면 push
        if (requestsObj[request.startDt]) {
          requestsObj[request.startDt].push(request.usingType);
          return;
        }
        requestsObj[request.startDt] = [request.usingType];
      } else {
        const start = dayjs(request.startDt);
        const end = dayjs(request.endDt);
        for (let date = start; date <= end; date = date.add(1, "day")) {
          requestsObj[date.format("YYYY-MM-DD")] = [request.usingType];
        }
      }
    });
  }

  return requestsObj;
};
