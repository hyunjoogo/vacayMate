const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveTypeSchema = new Schema({
  name: {type: String},
  daysPerYear: {type: Number},
});
module.exports = mongoose.model('LeaveType', LeaveTypeSchema);
