import dayjs from "dayjs";
import { RequestsObj } from "./getRequestsObj";
import { Request } from "./RequestPage";

export const getSelectedObj = (selectedValue: Request) => {
  const selectedObj: RequestsObj = {};

  if (selectedValue.startDt === selectedValue.endDt) {
    selectedObj[selectedValue.startDt] = [selectedValue.usingType];
  } // 시작일과 종료일이 다르면?
  else {
    const start = dayjs(selectedValue.startDt);
    const end = dayjs(selectedValue.endDt);
    for (let date = start; date <= end; date = date.add(1, "day")) {
      selectedObj[date.format("YYYY-MM-DD")] = [selectedValue.usingType];
    }
  }

  return selectedObj;
};
