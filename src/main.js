import { RequestSettings } from './const.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import UserSettingsPresenter from './presenter/user-settings-presenter.js';
import MoviesApiService from './services/movies-api-service.js';

import MovieModel from './model/movie-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

const siteMainNode = document.querySelector('.main');
const siteHeaderNode = document.querySelector('.header');
const siteFooterNode = document.querySelector('.footer');

const moviesApiService = new MoviesApiService(RequestSettings.END_POINT, RequestSettings.AUTHORIZATION);

const movieModel = new MovieModel(moviesApiService);
const commentsModel = new CommentsModel(moviesApiService);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainNode, filterModel, movieModel);
const boardPresenter = new BoardPresenter(siteMainNode, siteFooterNode, movieModel, commentsModel, filterModel);
const userSettingsPresenter = new UserSettingsPresenter(siteHeaderNode, movieModel);

movieModel.init();
filterPresenter.init();
boardPresenter.init();
userSettingsPresenter.init();
