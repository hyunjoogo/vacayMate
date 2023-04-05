const mongoose = require('mongoose');

const cancelHistorySchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RequestHistory',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  useType: {
    type: String,
    required: true
  },
  requestDays: {
    type: Number,
    required: true
  },
  previous_status: {
    type: String,
    required: true
  },
  memo: {
    type: String,
    maxlength: 1000
  },
  cancelDate: {
    type: Date,
    default: Date.now
  }
});

const CancelHistory = mongoose.model('CancelHistory', cancelHistorySchema);

module.exports = CancelHistory;
