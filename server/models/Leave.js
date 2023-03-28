const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
  requestedBy: {type: Schema.Types.ObjectId, ref: 'User'},
  leaveType: {type: Schema.Types.ObjectId, ref: 'LeaveType'},
  startDate: {type: Date},
  endDate: {type: Date},
  leaveTime: {type: Number},
  status: {type: String},
  managerComment: {type: String},
  optional: {type: String},
});
module.exports = mongoose.model('Leave', LeaveSchema);
