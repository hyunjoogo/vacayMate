const userService = require("../../services/user/userService");

exports.getMyProfile = async (req, res) => {
  // 가입정보
  // 나의 휴가유형들

  try {
    console.log(req.user.id);
    const myVacations = await userService.getMyVacations(req.user.id);
    // 빈 배열이 나오면 생성된 휴가타입이 아무것도 없으므로 클라이언트에서 입사일을 입력할 수 있도록 해야한다.
    // 또는 휴가타입을 가지고 오기전에 req.user.enterDate가 없으니까 그전에 빠져나가게 하는 것도 맞을지도



    res.status(200).json(myVacations);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: '서버 에러 발생'});
  }
};

