import { Request } from "./RequestPage";
import { getRequestsObj } from "./getRequestsObj";
import { getSelectedObj } from "./getSelectedObj";

export const checkUsingType = (requests: Request[], selectedValue: Request) => {
  const requestsObj = getRequestsObj(requests);
  const selectedObj = getSelectedObj(selectedValue);

  // 순회하다가 문제가 생기면 에러만 보냄
  // 통과하면 문제 없음
  Object.keys(selectedObj).forEach((key) => {
    if (requestsObj[key]) {
      const requestsDayUsingTypes = requestsObj[key];

      if (requestsDayUsingTypes.includes("일차")) {
        throw Error("기존항목에 일차가 있어서 안됨");
      }
      if (requestsDayUsingTypes.length === 2) {
        throw Error("오전반차, 오후반차가 있어서 아무것도 들어올 수 없음");
      }
      if (requestsDayUsingTypes.includes("오전반차")) {
        // 선택한 사용유형이 일차 또는 오전반차라면 에러
        if (
          selectedObj[key].includes("일차") ||
          selectedObj[key].includes("오전반차")
        ) {
          throw Error(
            "해당 날짜의 오전반차일 때는 일차, 오전반차를 선택할 수 없습니다."
          );
        }
      }
      if (requestsDayUsingTypes.includes("오후반차")) {
        // 선택한 사용유형이 일차 또는 오후반차라면 에러
        if (
          selectedObj[key].includes("일차") ||
          selectedObj[key].includes("오후반차")
        ) {
          throw Error(
            "해당 날짜의 오후반차일 때는 일차, 오후반차를 선택할 수 없습니다."
          );
        }
      }
    }
  });
};
