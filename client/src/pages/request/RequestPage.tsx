import React, { useState } from "react";
import dayjs from "dayjs";
import { nowFormat } from "../../utils/DateUtil";
import { getRestDeInfo, getRestDeInfo2023 } from "../../utils/getRestDeInfo";

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

const usingTypes = ["일차", "오전반차", "오후반차"];

const RequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedValue, setSelectedValue] = useState({
    type: "",
    usingType: "",
    startDt: nowFormat("YYYY-MM-DD"),
    endDt: nowFormat("YYYY-MM-DD"),
  });

  const addRequest = () => {
    console.log(selectedValue);
    setRequests([
      ...requests,
      {
        ...selectedValue,
        usingDays: getUsingDays(
          selectedValue.usingType,
          selectedValue.startDt,
          selectedValue.endDt
        ),
      },
    ]);
  };

  const getUsingDays = (usingType: string, startDt: string, endDt: string) => {
    const diff = getDaysDiff(startDt, endDt);
    const defaultUsingDaysByType = usingType === "일차" ? 1 : 0.5;
    if (diff === 0) {
      return defaultUsingDaysByType;
    }
    return defaultUsingDaysByType * diff;
  };

  // TODO 공휴일인지 확인하는 함수 구현 후 다시 진행할 것
  // 토요일, 일요일, 공휴일이 들어가 있으면 날짜를 안쳐야한다
  const getDaysDiff = (startDt: string, endDt: string): number => {
    const start = dayjs(startDt);
    const end = dayjs(endDt);
    const diff = end.diff(start, "day");
    return diff;
  };

  return (
    <>
      <button onClick={() => getRestDeInfo2023()}>가지고 오기</button>
      <ul>
        {vacations.map((vacation) => (
          <li key={vacation.type}>
            {vacation.type} : {vacation.leftDays} / {vacation.totalDays}
          </li>
        ))}
      </ul>
      <div>
        <label>휴가 유형</label>
        <select
          value={selectedValue.type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            console.log(e.target.value);
            setSelectedValue({ ...selectedValue, type: e.target.value });
          }}
        >
          {vacations.map((vacation) => (
            <option key={vacation.type} value={vacation.type}>
              {vacation.type}
            </option>
          ))}
        </select>
        <label>사용 유형</label>
        <select
          value={selectedValue.usingType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedValue({ ...selectedValue, usingType: e.target.value });
          }}
        >
          {usingTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>시작날짜</label>
        <input
          type="date"
          value={selectedValue.startDt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedValue({ ...selectedValue, startDt: e.target.value });
          }}
        />
        <label>종료일</label>
        <input
          type="date"
          value={selectedValue.endDt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedValue({ ...selectedValue, endDt: e.target.value });
          }}
        />
        <button onClick={addRequest}>+</button>
      </div>
      <hr />
      <ul>
        {requests.map((request, index) => {
          return (
            <li key={index}>
              {request.type} - {request.usingType} : {request.usingDays} <br />
              {request.startDt} ~ {request.endDt}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RequestPage;
