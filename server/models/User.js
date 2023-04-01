const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  profileImage: {
    type: String
  },
  department: {
    type: String
  },
  position: {
    type: String
  },
  role: {
    type: String,
    default: 'user'
  },
  leaveTypes: [
    {
      leaveType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveType'
      },
      days: {
        type: Number,
        default: 0
      },
      usedDays: {
        type: Number,
        default: 0
      }
    }
  ]
});
module.exports = mongoose.model('User', UserSchema);
