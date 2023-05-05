import axios from "axios";

export const getRestDeInfo = async (year = "2023", month = "04") => {
  const serviceKey = process.env.REACT_APP_DATA_GO_KR_SERVICE_KEY;
  const fixUrl =
    "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";
  const params = `?numOfRows=20&solYear=${year}&solMonth=${month}&_type=json&ServiceKey=${serviceKey}`;
  const url = fixUrl + params;
  const restDeInfo = await axios.get(url);
  const totalCount = restDeInfo.data.response.body.totalCount;

  if (totalCount === 0) {
    return null;
  }

  let restDeInfoList =
    totalCount === 1
      ? [restDeInfo.data.response.body.items.item]
      : restDeInfo.data.response.body.items.item;

  if (month === "01") {
    restDeInfoList[0].dateName = "구정";
  }

  if (month === "12") {
    restDeInfoList.forEach((item) => {
      if (item.dateName === "기독탄신일") {
        item.dateName = "크리스마스";
      }
    });
  }
  return restDeInfoList;
};

const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

export const getRestDeInfo2023 = async () => {
  const list2023 = [];

  for (let i = 0; i < months.length; i++) {
    const restDeInfo = await getRestDeInfo("2023", months[i]);
    if (restDeInfo !== null) {
      list2023.push(...restDeInfo);
    }
  }

  console.log(list2023);

  return list2023;
};
