import React, { useState } from "react";
import dayjs from "dayjs";
import { nowFormat } from "../../utils/DateUtil";

interface Vacation {
  type: string;
  leftDays: number;
  totalDays: number;
  expirationDate: string;
}

interface Request {
  type: string;
  usingType: string;
  startDt: string;
  endDt: string;
  usingDays: number;
}

const vacations: Vacation[] = [
  { type: "연차", leftDays: 31, totalDays: 31, expirationDate: "2024-05-01" },
  { type: "여름휴가", leftDays: 5, totalDays: 5, expirationDate: "2023-12-31" },
  { type: "대체휴무", leftDays: 3, totalDays: 3, expirationDate: "2023-06-31" },
];

const RequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  return (
    <>
      <ul>
        {vacations.map((vacation) => (
          <li key={vacation.type}>
            {vacation.type} : {vacation.leftDays} / {vacation.totalDays}
          </li>
        ))}
      </ul>
    </>
  );
};

export default RequestPage;
