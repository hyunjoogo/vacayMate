import dayjs from "dayjs";
import { Request } from "./RequestPage";
import { isHoliday } from "../../utils/DateUtil";

const tt = (date: any) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const splitByHoliday = (selectedValue: Request) => {
  let splitArray: Request[] = [];

  // 같은 날짜이면 splitArray에 selectedValue를 담아서 리턴
  if (selectedValue.startDt === selectedValue.endDt) {
    splitArray.push(selectedValue);
  } else {
    const filteredDates = [];
    const start = dayjs(selectedValue.startDt);
    const end = dayjs(selectedValue.endDt);
    for (let date = start; date <= end; date = date.add(1, "day")) {
      if (!isHoliday(tt(date))) {
        filteredDates.push(tt(date));
      }
    }

    let startDt = filteredDates[0];
    filteredDates.forEach((date, index, array) => {
      if (array[index + 1]) {
        const addDate = dayjs(date).add(1, "day");
        if (addDate.format("YYYY-MM-DD") !== array[index + 1]) {
          splitArray.push({
            type: selectedValue.type,
            startDt: startDt,
            endDt: tt(date),
            usingType: selectedValue.usingType,
          });
          startDt = array[index + 1];
        }
      } else {
        splitArray.push({
          type: selectedValue.type,
          startDt: startDt,
          endDt: tt(date),
          usingType: selectedValue.usingType,
        });
      }
    });
  }
  console.log(splitArray);
  return splitArray;
};
