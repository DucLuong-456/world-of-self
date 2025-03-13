import dayjs from 'dayjs';

export const getTodayFormatted = () => {
  return dayjs().format('YYYY-MM-DD');
};

export const getStartOfDate = () => {
  return dayjs().startOf('day').format('YYYY-MM-DD');
};

export const getEndOfDate = () => {
  return dayjs().endOf('day').format('YYYY-MM-DD');
};
