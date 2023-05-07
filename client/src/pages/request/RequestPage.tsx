import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { isHoliday, nowFormat } from "../../utils/DateUtil";

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

const vacationsDummy: Vacation[] = [
  { type: "연차", leftDays: 31, totalDays: 31, expirationDate: "2024-05-01" },
  { type: "여름휴가", leftDays: 5, totalDays: 5, expirationDate: "2023-12-31" },
  { type: "대체휴무", leftDays: 3, totalDays: 3, expirationDate: "2023-06-31" },
];

const usingTypes = ["일차", "오전반차", "오후반차"];

const RequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedValue, setSelectedValue] = useState({
    type: "연차",
    usingType: "일차",
    startDt: nowFormat("YYYY-MM-DD"),
    endDt: nowFormat("YYYY-MM-DD"),
  });
  const [vacations, setVacations] = useState<Vacation[]>([]);

  useEffect(() => {
    setVacations(vacationsDummy);
  }, []);

  const addRequest = () => {
    const start = dayjs(selectedValue.startDt);
    const end = dayjs(selectedValue.endDt);
    const diff = end.diff(start, "day");

    if (selectedValue.type === "") {
      return console.error("휴가유형을 선택해주세요");
    }
    if (selectedValue.usingType === "") {
      return console.error("사용유형을 선택해주세요");
    }
    if (isHoliday(selectedValue.startDt) || isHoliday(selectedValue.endDt)) {
      return console.error(
        "시작날짜와 종료날짜에 공휴일 또는 주말을 선택할 수 없습니다."
      );
    }
    if (diff < 0) {
      return console.error("시작날짜 < 종료날짜이어야합니다.");
    }

    const usingDays = getUsingDays(
      selectedValue.usingType,
      selectedValue.startDt,
      selectedValue.endDt
    );

    setRequests((prevState) => {
      return [
        ...prevState,
        {
          ...selectedValue,
          usingDays,
        },
      ];
    });

    setVacations((prevState) => {
      const targetVacationIndex = prevState.findIndex((vacation) => {
        return vacation.type === selectedValue.type;
      });

      if (targetVacationIndex !== -1) {
        prevState[targetVacationIndex].leftDays -= usingDays;
      } else {
        console.log("No matching vacation type found.");
      }

      return [...prevState];
    });
  };

  const getUsingDays = (usingType: string, startDt: string, endDt: string) => {
    const diff = getDaysDiff(startDt, endDt);
    const defaultUsingDaysByType = usingType === "일차" ? 1 : 0.5;
    if (diff === 0) {
      return defaultUsingDaysByType;
    }
    return defaultUsingDaysByType * diff;
  };

  // 선택한 날짜 중에 공휴일, 주말이 끼어있으면 신청일에 제외된다.
  const getDaysDiff = (startDt: string, endDt: string): number => {
    const start = dayjs(startDt);
    const end = dayjs(endDt);
    let diff = 0;
    for (let date = start; date <= end; date = date.add(1, "day")) {
      if (!isHoliday(dayjs(date).format("YYYY-MM-DD"))) {
        diff += 1;
      }
    }
    return diff;
  };

  const deleteRequest = (targetIndex: number) => {
    const newRequests = [...requests];
    const target = requests[targetIndex];
    newRequests.splice(targetIndex, 1);
    setRequests(newRequests);

    setVacations((prevState) => {
      const targetVacationIndex = prevState.findIndex((vacation) => {
        return vacation.type === target.type;
      });

      if (targetVacationIndex !== -1) {
        prevState[targetVacationIndex].leftDays += target.usingDays;
      } else {
        console.error("No matching vacation type found.");
      }

      return [...prevState];
    });
  };

  return (
    <>
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
            setSelectedValue({ ...selectedValue, type: e.target.value });
          }}
        >
          <option value="" disabled>
            -----
          </option>
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
          <option value="" disabled>
            -----
          </option>
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
            const startDt = e.target.value;
            if (isHoliday(startDt)) {
              return;
            }
            setSelectedValue({ ...selectedValue, startDt });
          }}
        />
        <label>종료일</label>
        <input
          type="date"
          value={selectedValue.endDt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const endDt = e.target.value;
            if (isHoliday(endDt)) {
              return;
            }
            setSelectedValue({ ...selectedValue, endDt });
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
              <button onClick={() => deleteRequest(index)}>X</button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RequestPage;
