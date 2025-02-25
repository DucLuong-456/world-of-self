import dayjs from 'dayjs';

export const getTodayFormatted = () => {
  return dayjs().format('YYYY-MM-DD');
};
