import { render } from './render.js';
import UserRankView from './view/user-rank-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilmStatisticsView from './view/films-statistics-view.js';

import MovieModel from './model/movie-model.js';
import TopRatedMovieModel from './model/top-rated-movie-model.js';
import MostCommentedMovieModel from './model/most-commented-movie-model.js';
import CommentsModel from './model/comments-model.js';

const siteMainNode = document.querySelector('.main');
const siteHeaderNode = document.querySelector('.header');
const siteFooterNode = document.querySelector('.footer');

const movieModel = new MovieModel();
const topRatedMovieModel = new TopRatedMovieModel();
const mostCommentedMovieModel = new MostCommentedMovieModel();
const commentsModel = new CommentsModel();

const boardPresenter = new BoardPresenter(siteMainNode, movieModel, topRatedMovieModel, mostCommentedMovieModel, commentsModel);

render(new UserRankView(), siteHeaderNode);
render(new FilmStatisticsView(), siteFooterNode);

boardPresenter.init();
