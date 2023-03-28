const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveTimeSchema = new Schema({
  name: {type: String},
  days: {type: Number},
});
module.exports = mongoose.model('LeaveTime', LeaveTimeSchema);
