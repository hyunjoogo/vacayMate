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
  approver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  canceler: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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
  }
}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('RequestHistory', requestHistorySchema);

