const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the UserVacation collection
const UserVacationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  leftDays: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create the UserVacation model
module.exports = mongoose.models.UserVacation || mongoose.model('UserVacation', UserVacationSchema);
