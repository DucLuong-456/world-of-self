import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

export const formatDate = (date: Date | string, format = "DD/MM/YYYY") => {
    if (!date) return "";
    return dayjs(date).format(format);
};