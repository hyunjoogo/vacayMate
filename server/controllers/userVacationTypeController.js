const UserVacation = require('../models/user-vacation');
const User = require('../models/user');
const VacationType = require('../models/vacation-type');
const Sequelize = require('sequelize');

exports.createUserVacation = async (req, res) => {
  const {userId, vacationTypeId, remainingDays, totalDays, expirationDate} = req.body;

  // TODO 똑같은 휴가 유형이 생성되지 않도록 하는 방법을 생각해 봅시다.
  // vacationType에서 2023년 귀속분 만들고 하나의 컬럼을 갖는 거지.
  // 그래서 해당유저가 그 vacationTypeId를 가지고 있다면 생성 불가

  try {
    // 새로운 User Vacation 레코드를 생성합니다.
    const newVacation = await UserVacation.create({
      userId,
      vacationTypeId,
      remainingDays,
      totalDays,
      expirationDate
    });

    // 생성된 레코드를 반환합니다.
    res.status(200).json({
      message: '사용자의 휴가 유형 등록이 완료되었습니다.',
      data: {userVacation: newVacation}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: 'Server error'});
  }
};

exports.getMyVacationTypes = async (req, res) => {
  const {nowPage = 1, pageSize = 10, name="", userId} = req.query;
  const offset = (nowPage - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const where = {
      userId,
      '$VacationType.name$': {
        [Sequelize.Op.like]: `%${name}%`
      }
    };
    const include = [
      {
        model: VacationType,
        attributes: ['name']
      }
    ];

    const userVacations = await UserVacation.findAndCountAll({
      where,
      include,
      offset,
      limit
    });

    res.status(200).json(userVacations);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: '서버 에러 발생'});
  }
};
