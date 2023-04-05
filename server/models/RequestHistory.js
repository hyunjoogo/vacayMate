const mongoose = require('mongoose');
const vacationType = require("../utils/vacationType");
const useTypes = require("../utils/useTypes");
const statusType = require("../utils/statusType");
const Schema = mongoose.Schema;

const requestHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: vacationType,
    required: true
  },
  useType: {
    type: String,
    enum: useTypes,
    required: true
  },
  memo: {
    type: String,
    maxlength: 1000
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: statusType,
    default: 'Pending'
  },
  requestDays: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approver: {
    // 상태가 cancelled인데 이 값이 있으면 승인되었다가 취소된 신청
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approverName: {
    // 상태가 cancelled인데 이 값이 있으면 승인되었다가 취소된 신청
    type: String
  },
  useHistoryId: {
    // 상태가 cancelled인데 이 값이 있으면 승인되었다가 취소된 신청
    type: Schema.Types.ObjectId,
    ref: 'UseHistory'
  },
  cancelHistoryId: {
    type: Schema.Types.ObjectId,
    ref: 'CancelHistory'
  },
  canceler: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelerName: {
    type: String
  },
});

const RequestHistory = mongoose.model('RequestHistory', requestHistorySchema);

module.exports = RequestHistory;
