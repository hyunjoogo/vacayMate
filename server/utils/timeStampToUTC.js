const dayjs = require('dayjs');

exports.convertTimestampToUTC = (unixTimestamp) => {
  if (unixTimestamp.length === 10) {
    return dayjs.unix(Number(unixTimestamp)).utc().format();
  } else {
    return dayjs(Number(unixTimestamp)).utc().format();
  }
};
