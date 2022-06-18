import dayjs from 'dayjs';
import { FilterType } from './const.js';

const humanizeFullDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');
const humanizeLongDate = (date) => dayjs(date).format('D MMMM YYYY');
const humanizeShortDate = (date) => dayjs(date).format('YYYY');
const formatMinutesToRuntime = (minutes) => minutes / 60 > 0 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;

const sortMovieByDate = (movieA, movieB) => dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date));
const sortMovieByRating = (movieA, movieB) => movieA.filmInfo.totalRating > movieB.filmInfo.totalRating ? -1 : 1;
const sortMovieByCommentsCount = (movieA, movieB) => movieA.comments.length > movieB.comments.length ? -1 : 1;

const sortCommentsByDate = (commentA, commentB) => dayjs(commentA.date).diff(dayjs(commentB.date));

const renderList = (items, render, container, presenter) => items.forEach((item) => render(item, container, presenter));

const filterMovies = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
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

export { humanizeLongDate, humanizeShortDate, humanizeFullDate, updateItem, sortMovieByDate, sortMovieByRating, sortMovieByCommentsCount, sortCommentsByDate, renderList, formatMinutesToRuntime, filterMovies };
