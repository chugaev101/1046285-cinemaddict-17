import dayjs from 'dayjs';

const getRandomInteger = (lower = 0, upper = 1) => Math.floor(lower + Math.random() * (upper - lower + 1));

const humanizeFullDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');
const humanizeLongDate = (date) => dayjs(date).format('D MMMM YYYY');
const humanizeShortDate = (date) => dayjs(date).format('YYYY');

const sortMovieByDate = (movieA, movieB) => dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date));

const sortMovieByRating = (movieA, movieB) => movieA.filmInfo.totalRating > movieB.filmInfo.totalRating ? -1 : 1;

const renderList = (items, renderRange, render, container) => {
  items.slice(0, Math.min(items.length, renderRange)).forEach((item) => render(item, container));
};

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

export { getRandomInteger, humanizeLongDate, humanizeShortDate, humanizeFullDate, updateItem, sortMovieByDate, sortMovieByRating, renderList };
