import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

export const isDateInCurrentWeek = (date: string) => {
  const inputDate = dayjs(date);
  const startOfWeek = dayjs().startOf('isoWeek'); // Lấy thứ Hai đầu tuần
  const endOfWeek = dayjs().endOf('isoWeek'); // Lấy Chủ Nhật cuối tuần

  return inputDate.isBetween(startOfWeek, endOfWeek, 'day', '[]');
};

// Test
// console.log(isDateInCurrentWeek('2025-02-23')); // true nếu ngày này thuộc tuần hiện tại
// console.log(isDateInCurrentWeek('2025-02-10')); // false nếu ngày này thuộc tuần trước
