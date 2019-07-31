export const formatDateToDay = function (dateObj) {
  if (dateObj && typeof dateObj === 'object') {
    // note this returns UTC time (at zone 0), which is not what we want
    // return dateObj.toISOString().replace(/([-0-9]{10})T([:0-9]{8}).*/, '$1 $2');

    const yearStr = dateObj.getFullYear();
    const monthStr = ('00' + (dateObj.getMonth() + 1)).slice(-2);
    const dateStr = ('00' + dateObj.getDate()).slice(-2);

    // hourStr = ('00' + dateObj.getHours()).slice(-2);
    // minuteStr = ('00' + dateObj.getMinutes()).slice(-2);
    // secondStr = ('00' + dateObj.getSeconds()).slice(-2);

    return `${yearStr}-${monthStr}-${dateStr}`;

  } else {
    return '';
  }
};
