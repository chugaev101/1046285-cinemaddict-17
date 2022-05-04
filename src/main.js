import { render } from './render.js';
import UserRankView from './view/user-rank-view.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilmStatisticsView from './view/films-statistics-view.js';
import MovieModel from './model/movie-model.js';
import CommentsModel from './model/comments-model.js';

const siteMainNode = document.querySelector('.main');
const siteHeaderNode = document.querySelector('.header');
const siteFooterNode = document.querySelector('.footer');
const movieModel = new MovieModel();
const commentsModel = new CommentsModel();
const boardPresenter = new BoardPresenter(siteMainNode, movieModel, commentsModel);

render(new UserRankView(), siteHeaderNode);
render(new MenuView(), siteMainNode);
render(new SortView(), siteMainNode);
render(new FilmStatisticsView(), siteFooterNode);

boardPresenter.init();
