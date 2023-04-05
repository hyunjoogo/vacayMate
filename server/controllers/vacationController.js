const RequestHistory = require('../models/RequestHistory');
const UseHistory = require('../models/UseHistory');
const CancelHistory = require("../models/CancelHistory");

exports.approveVacation = async (req, res) => {
  try {
    const {requestId} = req.params;
    const {approverId, approverName} = req.body;


    const requestHistory = await RequestHistory.findById(requestId);

    if (!requestHistory) {
      return res.status(404).json({message: '해당하는 휴가 요청을 찾을 수 없습니다.'});
    }

    if (requestHistory.status === 'cancelled') {
      return res.status(400).json({message: '해당 휴가는 이미 취소되었습니다. 다시 요청해주세요.'});
    }

    if (requestHistory.status === 'approved') {
      return res.status(400).json({message: '이미 승인된 휴가 요청입니다.'});
    }

    if (requestHistory.status === 'pending') {

      // 승인된 휴가에 대한 UseHistory 항목 생성
      const useHistory = new UseHistory({
        request: requestId,
        user: requestHistory.user,
        startDate: requestHistory.startDate,
        endDate: requestHistory.endDate,
        type: requestHistory.type,
        requestDays: requestHistory.requestDays,
        memo: requestHistory.memo
      });

      await useHistory.save();

      // RequestHistory 객체를 직접 수정합니다.
      requestHistory.status = 'approved';
      requestHistory.approver = approverId;
      requestHistory.approverName = requestHistory;
      requestHistory.useHistoryId = useHistory._id;

      // 변경된 RequestHistory 객체를 저장합니다.
      const updatedRequestHistory = await requestHistory.save();

      res.status(200).json({message: '휴가가 성공적으로 승인되었습니다.', data: updatedRequestHistory});
    }
  } catch (error) {
    res.status(500).json({message: '휴가 승인 중 오류가 발생했습니다.', error});
  }
};

exports.cancelVacation = async (req, res) => {
  try {
    const {requestId} = req.params;
    const {
      cancelerId,
      cancelerName,
      memo
    } = req.body;

    // RequestHistory를 조회하여 이전 상태를 확인합니다.
    const requestHistory = await RequestHistory.findById(requestId);
    if (!requestHistory) {
      return res.status(404).json({message: '해당하는 휴가 요청을 찾을 수 없습니다.'});
    }

    // CancelHistory를 생성하고 저장합니다.
    const cancelHistory = new CancelHistory({
      request: requestId,
      user: cancelerId,
      startDate: requestHistory.startDate,
      endDate: requestHistory.endDate,
      type: requestHistory.type,
      useType: requestHistory.useType,
      requestDays: requestHistory.requestDays,
      previous_status: requestHistory.status,
      memo: memo
    });

    await cancelHistory.save();

    // 휴가 사용 신청을 취소 처리를 수행합니다.
    // RequestHistory 객체를 직접 수정합니다.
    requestHistory.status = 'cancelled';
    requestHistory.cancelHistoryId = cancelHistory._id;
    requestHistory.canceler = cancelerId;
    requestHistory.cancelerName = cancelerName;

    // 변경된 RequestHistory 객체를 저장합니다.
    const updateRequestHistory = await requestHistory.save();

    if (requestHistory.status === 'approved') {
      await UseHistory.findOneAndDelete({request: requestId});
    }

    res.status(200).json({message: '휴가가 성공적으로 취소되었습니다.', data: updateRequestHistory});
  } catch (error) {
    res.status(500).json({message: '휴가 취소 중 오류가 발생했습니다.', error});
  }
};
