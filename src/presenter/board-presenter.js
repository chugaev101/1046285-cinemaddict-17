import { updateItem, sortMovieByDate, sortMovieByRating } from '../utils.js';
import { RenderPosition, render, remove } from '../framework/render.js';
import MenuView from '../view/menu-view.js';
import SortView from '../view/sort-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTitleView from '../view/films-list-title-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import MoviePresenter from './movie-presenter.js';
import { SortType } from '../const.js';

const MOVIE_COUNT_PER_STEP = 5;
const TOP_RATED_MOVIE_COUNT_PER_STEP = 2;
const MOST_COMMENTED_MOVIE_COUNT_PER_STEP = 2;

export default class BoardPresenter {
  #movieModel = null;
  #topRatedMovieModel = null;
  #mostCommentedMovieModel = null;
  #commentsModel = null;

  #boardContainer = null;
  #boardComponent = new FilmsBoardView();
  #mainListComponent = new FilmsListView();
  #topRatedListComponent = new FilmsListView(true);
  #mostCommentedListComponent = new FilmsListView(true);

  #sortComponent = new SortView();
  #currentSortType = SortType.DEFAULT;

  #menuComponent = null;

  #showMoreButtonComponent = new ShowMoreButtonView();

  #boardMovies = [];
  #sourcedBoardMovies = [];
  #topRatedMovies = [];
  #mostCommentedMovies = [];
  #comments = [];
  #moviePresenter = new Map();

  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  constructor(container, movieModel, topRatedMovieModel, mostCommentedMovieModel, commentsModel) {
    this.#boardContainer = container;
    this.#movieModel = movieModel;
    this.#topRatedMovieModel = topRatedMovieModel;
    this.#mostCommentedMovieModel = mostCommentedMovieModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#boardMovies = [...this.#movieModel.movies];
    this.#sourcedBoardMovies = [...this.#movieModel.movies];
    this.#topRatedMovies = [...this.#topRatedMovieModel.movies];
    this.#mostCommentedMovies = [...this.#mostCommentedMovieModel.movies];
    this.#comments = [...this.#commentsModel.comments];
    this.#menuComponent = new MenuView(this.#boardMovies);

    this.#renderBoard();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#boardContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#boardMovies.sort(sortMovieByDate);
        break;
      case SortType.RATING:
        this.#boardMovies.sort(sortMovieByRating);
        break;
      default:
        this.#boardMovies = [...this.#sourcedBoardMovies];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearMovieList();

    this.#renderMovies(this.#boardMovies, 0, Math.min(this.#boardMovies.length, this.#renderedMovieCount), this.#mainListComponent);
    this.#renderMovies(this.#topRatedMovies, 0, Math.min(this.#topRatedMovies.length, TOP_RATED_MOVIE_COUNT_PER_STEP), this.#topRatedListComponent);
    this.#renderMovies(this.#mostCommentedMovies, 0, Math.min(this.#mostCommentedMovies.length, MOST_COMMENTED_MOVIE_COUNT_PER_STEP), this.#mostCommentedListComponent);
    if (this.#boardMovies.length > this.#renderedMovieCount) {
      this.#rendershowMoreButton();
    }
  };

  #renderMenu = () => {
    render(this.#menuComponent, this.#boardContainer);
  };

  #renderTitle = (movies, container, isTopRated, isMostComment) => {
    render(new FilmsListTitleView(movies, isTopRated, isMostComment), container.element, RenderPosition.AFTERBEGIN);
  };

  #renderMovie = (movie, container) => {
    const moviePresenter = new MoviePresenter(container, this.#comments, this.#handleMovieChange, this.#handleModeChange);
    moviePresenter.init(movie);

    this.#moviePresenter.set(movie.id, moviePresenter);
  };

  #renderMovies = (movies, from, to, container) => {
    movies.slice(from, to)
      .forEach((movie) => this.#renderMovie(movie, container));
  };

  #renderMainMovieList = () => {
    this.#renderTitle(this.#boardMovies, this.#mainListComponent);
    render(this.#mainListComponent, this.#boardComponent.element);
    this.#renderMovies(this.#boardMovies, 0, Math.min(this.#boardMovies.length, MOVIE_COUNT_PER_STEP), this.#mainListComponent);

    if (this.#boardMovies.length > MOVIE_COUNT_PER_STEP) {
      this.#rendershowMoreButton();
    }
  };

  #renderTopRatedMovieList = () => {
    if (!this.#topRatedMovies.length) {
      return;
    }

    render(this.#topRatedListComponent, this.#boardComponent.element);
    this.#renderTitle(this.#topRatedMovies, this.#topRatedListComponent, true, false);

    this.#renderMovies(this.#topRatedMovies, 0, Math.min(this.#topRatedMovies.length, TOP_RATED_MOVIE_COUNT_PER_STEP), this.#topRatedListComponent);
  };

  #renderMostCommentedMovieList = () => {
    if (!this.#mostCommentedMovies.length) {
      return;
    }

    render(this.#mostCommentedListComponent, this.#boardComponent.element);
    this.#renderTitle(this.#mostCommentedMovies, this.#mostCommentedListComponent, false, true);
    this.#renderMovies(this.#mostCommentedMovies, 0, Math.min(this.#mostCommentedMovies.length, MOST_COMMENTED_MOVIE_COUNT_PER_STEP), this.#mostCommentedListComponent);
  };

  #handleMovieChange = (updateMovie) => {
    this.#boardMovies = updateItem(this.#boardMovies, updateMovie);
    this.#topRatedMovies = updateItem(this.#topRatedMovies, updateMovie);
    this.#mostCommentedMovies = updateItem(this.#mostCommentedMovies, updateMovie);

    this.#moviePresenter.get(updateMovie.id).init(updateMovie);
  };

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  };

  #clearMovieList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    // this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #rendershowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#mainListComponent.element);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreClick);
  };

  #handleShowMoreClick = () => {
    this.#boardMovies
      .slice(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#mainListComponent));

    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#boardMovies.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderBoard = () => {
    this.#renderMenu();
    this.#renderSort();

    render(this.#boardComponent, this.#boardContainer);

    this.#renderMainMovieList();
    this.#renderTopRatedMovieList();
    this.#renderMostCommentedMovieList();
  };
}
