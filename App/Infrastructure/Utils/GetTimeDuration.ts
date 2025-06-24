import moment from 'moment';

type getDurationType = 'days' | 'hours' | 'minutes';
export const getDuration = (date: any, type: getDurationType) => {
  const now = moment();
  const expiry = moment(date);
  const difference = expiry.diff(now, 'minute', true);
  const diffDuration = moment.duration(difference, 'minutes');

  if (type === 'days') {
    return diffDuration.asDays();
  }
  if (type === 'hours') {
    return diffDuration.asHours();
  }
  if (type === 'minutes') {
    return diffDuration.asMinutes();
  }
};
