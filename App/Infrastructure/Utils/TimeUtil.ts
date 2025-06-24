const moment = require('moment');
import { DateTime } from 'luxon';

class TimeUtil {
  static getDiffBetweenTwoDates(
    date1,
    date2,
    { precision = false, diffCriteria = 'days' },
  ) {
    const diff = moment(date1).diff(moment(date2), diffCriteria, precision);

    return diff;
  }

  static parse(date, timeZone = 'America/New_York') {
    return DateTime.fromISO(date).setZone(timeZone);
  }

  static now(timeZone = 'utc') {
    return DateTime.now().setZone(timeZone);
  }

  static formatDate(date, format = 'LL-dd-yyyy HH:mm:ss') {
    return this.parse(date).toFormat(format);
  }

  static isGreaterThan(
    date,
    otherDate,
    equalAllowed = true,
    timeZone = 'America/New_York',
  ) {
    date = this.parse(date, timeZone);
    otherDate = this.parse(otherDate, timeZone);

    if (equalAllowed) return date > otherDate || date === otherDate;

    return date > otherDate;
  }

  static isLessThan(date, otherDate, equalAllowed = true, timeZone = 'America/New_York') {
    date = this.parse(date, timeZone);
    otherDate = this.parse(otherDate, timeZone);

    if (equalAllowed) return date < otherDate || date === otherDate;

    return date < otherDate;
  }

  /**
   *
   * @param {!(string | Date)} date - iso date string
   * @param {string} format - luxon date format
   * @refrence [luxon formatting](https://moment.github.io/luxon/docs/manual/formatting.html)
   */
  static getUSDateString(date, format = 'LL-dd-yyyy HH:mm:ss') {
    date =
      typeof date === 'string' ? date : date.toISO ? date.toISO() : date.toISOString();
    return DateTime.fromISO(date).setZone('utc').toFormat(format);
  }
}

export default TimeUtil;
