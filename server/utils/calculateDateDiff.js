const moment = require('moment');

function calculateDateDiff(startDate, endDate) {
  const momentStartDate = moment(startDate, 'YYYY-MM-DD');
  const momentEndDate = moment(endDate, 'YYYY-MM-DD');
  const diffInDays = momentEndDate.diff(momentStartDate, 'days');
  if (diffInDays < 0) {
    return -1;
  }
  return diffInDays + 1;
}

module.exports = calculateDateDiff;
