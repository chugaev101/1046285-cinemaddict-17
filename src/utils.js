import dayjs from 'dayjs';

const getRandomInteger = (lower = 0, upper = 1) => Math.floor(lower + Math.random() * (upper - lower + 1));

const humanizeFullDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');
const humanizeLongDate = (date) => dayjs(date).format('D MMMM YYYY');
const humanizeShortDate = (date) => dayjs(date).format('YYYY');

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export { getRandomInteger, humanizeLongDate, humanizeShortDate, humanizeFullDate, updateItem };
