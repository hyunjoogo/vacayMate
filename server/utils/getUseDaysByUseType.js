function getUseDaysByUseType(useType) {
  switch (useType) {
    case "dayOff" :
      return 1;
      break;
    case "morningOff" , "afternoonOff":
      return 0.5;
      break;
    default:
      throw new Error("잘못된 사용종류입니다");
  }
}

module.exports = getUseDaysByUseType;
