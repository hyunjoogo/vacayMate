// handlers.js
import { rest } from "msw";

export const handlers = [
  rest.get(
    "http://localhost:3300/api/user/1/approved-request",
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1,
            userId: 1,
            userName: "Test User",
            useDate: "2023-04-02",
            usingType: "오전반차",
          },
          {
            id: 2,
            userId: 1,
            userName: "Test User",
            useDate: "2023-04-03",
            usingType: "오후반차",
          },
        ])
      );
    }
  ),
];
