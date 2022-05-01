import dayjs from 'dayjs';

const getRandomInteger = (lower = 0, upper = 1) => Math.floor(lower + Math.random() * (upper - lower + 1));

const humanizeFullDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');
const humanizeLongDate = (date) => dayjs(date).format('D MMMM YYYY');
const humanizeShortDate = (date) => dayjs(date).format('YYYY');

export { getRandomInteger, humanizeLongDate, humanizeShortDate, humanizeFullDate };
