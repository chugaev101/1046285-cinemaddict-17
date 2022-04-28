import {render} from './render.js';
import UserRankView from './view/user-rank-view.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilmPopupInfoView from './view/film-popup-info-view.js';
import FilmStatisticsView from './view/films-statistics-view.js';

const siteBodyNode = document.querySelector('body');
const siteMainNode = document.querySelector('.main');
const siteHeaderNode = document.querySelector('.header');
const siteFooterNode = document.querySelector('.footer');
const boardPresenter = new BoardPresenter();

render(new UserRankView(), siteHeaderNode);
render(new MenuView(), siteMainNode);
render(new SortView(), siteMainNode);
render(new FilmPopupInfoView(), siteBodyNode);
render(new FilmStatisticsView(), siteFooterNode);

boardPresenter.init(siteMainNode);
