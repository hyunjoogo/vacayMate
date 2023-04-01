const express = require('express');
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const User = require('../models/User');
const UserVacation = require('../models/UserVacation');

// 휴가 유형 생성
router.post('/:id', verifyToken, async (req, res) => {
    // TODO validation
    // vacationType이 맞는지 확인할 것 (utils > vacationType.js 참조)
    // if (!vacationTypes.includes(req.body.type)) {
    //   res.status(400).json({ message: 'Invalid vacation type' });
    //   return;
    // }
    // TODO 사용자가 존재하는지 여부 확인할 것
    //

    try {

      const userVacation = await UserVacation.findOne({
        user: req.params.id, type: req.body.type,
        expirationDate: req.body.expirationDate
      });

      if (userVacation) {
        res.status(400).json({message: '이미 생성된 휴가 유형입니다.'});
        return;
      }
      const newUserVacation = new UserVacation({
        user: req.params.id,
        type: req.body.type,
        totalDays: req.body.totalDays,
        leftDays: req.body.leftDays,
        expirationDate: req.body.expirationDate
      });
      console.log(newUserVacation);
      await newUserVacation.save();

      res.status(200).json({message: '휴가 생성 완료'});
    } catch (err) {
      console.error(err);
      res.status(500).json({message: '서버 에러가 발생했습니다.'});
    }
  }
);

/**
 * @route GET /userVacations
 * @desc Retrieve all UserVacation documents from the database
 * @access Public
 * @param {String} sort - Optional sorting criteria (name, created_at, or type)
 * @returns {Object} - Object containing all UserVacation documents
 * @example GET /userVacations?sort=name
 */

// 데이터베이스에서 모든 UserVacation 문서를 조회하는 GET 요청을 처리하는 라우트를 정의합니다.
router.get('/', (req, res) => {
  // 조회 쿼리에 대한 정렬 기준을 담을 객체를 정의합니다.
  const sortCriteria = {};

  // 쿼리 매개변수를 확인하여 정렬 옵션을 설정하고 해당하는 정렬 기준 객체 키를 설정합니다.
  if (req.query.sort === 'name') {
    sortCriteria.user = 1; // 사용자 이름을 오름차순으로 정렬합니다.
  } else if (req.query.sort === 'created_at') {
    sortCriteria.created_at = 1; // 생성 시간을 내림차순으로 정렬합니다.
  } else if (req.query.sort === 'type') {
    sortCriteria.type = 1; // 휴가 유형을 오름차순으로 정렬합니다.
  }

  // 쿼리 옵션 객체를 정의합니다.
  const queryOptions = {
    sort: sortCriteria
  };

  // 데이터베이스에서 모든 UserVacation 문서를 조회하는 쿼리를 실행합니다.
  UserVacation.find({}, null, queryOptions)
  .populate('user', 'name') // user 필드를 해당 User 문서의 name 속성으로 채웁니다.
  .then(docs => {
    res.send(docs); // 조회된 문서들을 응답으로 클라이언트에게 전송합니다.
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('내부 서버 오류'); // 데이터베이스 쿼리가 실패한 경우 오류 응답을 전송합니다.
  });
});

/**
 *  @route GET /userVacations/:id
 *  @desc 데이터베이스에서 id로 단일 UserVacation 문서를 검색합니다.
 *  @access Public
 *  @param {String} id - 검색할 UserVacation 문서의 id
 *  @returns {Object} - 검색된 UserVacation 문서를 포함하는 객체
 *  @example GET /userVacations/60e82090a040f745a894b8de
 *  데이터베이스에서 해당 id를 가진 UserVacation 문서를 검색합니다.
 *  검색된 문서의 user 필드는 해당 사용자의 이름 속성으로 채워집니다.
 *  데이터베이스 쿼리가 실패하거나 요청된 문서가 존재하지 않는 경우, 상태 코드 404와 함께 에러 응답을 보냅니다.
 */
router.get('/:id', (req, res) => {
// 데이터베이스에서 지정된 id를 가진 UserVacation 문서를 검색하기 위해 쿼리를 실행합니다.
  UserVacation.findById(req.params.id)
  .populate('user', 'name') // 검색된 문서의 user 필드는 해당 사용자의 이름 속성으로 채워집니다.
  .then(doc => {
    if (!doc) {
      res.status(404).send('UserVacation document not found'); // 요청된 문서가 존재하지 않는 경우, 에러 응답을 보냅니다.
    } else {
      res.send(doc); // 검색된 문서를 클라이언트에 응답으로 보냅니다.
    }
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Internal Server Error'); // 데이터베이스 쿼리가 실패하는 경우, 에러 응답을 보냅니다.
  });
});


module.exports = router;
