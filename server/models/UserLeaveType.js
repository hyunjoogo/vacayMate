const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserLeaveTypeSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  leaveType: {type: Schema.Types.ObjectId, ref: 'LeaveType'},
  daysLeft: {type: Number},
});
module.exports =  mongoose.model('UserLeaveType', UserLeaveTypeSchema);
