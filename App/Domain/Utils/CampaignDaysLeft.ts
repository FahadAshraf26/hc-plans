import moment from 'moment-timezone';

export const timeLeft = (timeZone: string, closingTime: any, closingDate: any) => {
  let now = moment.tz(timeZone);
  let endTime = moment.tz(
    `${moment(closingDate, 'MM-DD-YYYY').format('YYYY-MM-DD')} ${closingTime}`,
    timeZone,
  );

  let timeRemaining = (Number(endTime) - Number(now)) / (60 * 1000);

  if (timeRemaining < 1) {
    return false;
  } else {
    return [Math.floor(timeRemaining / 60), Math.floor(timeRemaining % 60)];
    //        return `${Math.floor(timeRemaining / 60)} hr(s) ${Math.floor(timeRemaining % 60)} min(s)`
  }
};
