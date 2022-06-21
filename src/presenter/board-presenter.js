import { sortMovieByDate, sortMovieByRating, sortMovieByCommentsCount, renderList, filterMovies } from '../utils.js';
import { RenderPosition, render, remove, replace } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTitleView from '../view/films-list-title-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import LoadingListView from '../view/loading-list-view.js';
import LoadingTotalCountView from '../view/loading-total-count.js';
import FilmStatisticsView from '../view/films-statistics-view.js';
import MoviePresenter from './movie-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { SortType, UpdateType, FilterType, UserAction } from '../const.js';

const MOVIE_COUNT_PER_STEP = 5;
const TOP_RATED_MOVIE_COUNT_PER_STEP = 2;
const MOST_COMMENTED_MOVIE_COUNT_PER_STEP = 2;

const comparersSort = {
  [SortType.DATE]: sortMovieByDate,
  [SortType.RATING]: sortMovieByRating
};

const TimeLimit = {
  LOWER_LIMT: 350,
  UPPER_LIMT: 350,
};

export default class BoardPresenter {
  #movieModel = null;
  #commentsModel = null;
  #filterModel = null;

  #boardContainer = null;
  #footer = null;
  #boardComponent = new FilmsBoardView();
  #mainListComponent = new FilmsListView();
  #topRatedListComponent = new FilmsListView(true);
  #mostCommentedListComponent = new FilmsListView(true);
  #mainTitleComponent = null;
  #loadingListComponent = new LoadingListView();
  #loadingTotalCountComponent = new LoadingTotalCountView();

  #sortComponent = new SortView();
  #currentSortType = SortType.DEFAULT;

  #showMoreButtonComponent = new ShowMoreButtonView();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMT, TimeLimit.UPPER_LIMT);

  #moviePresenter = new Map();
  #topRatedMoviePresenter = new Map();
  #mostCommentedMoviePresenter = new Map();

  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #isLoading = true;

  constructor(container, footer, movieModel, commentsModel, filterModel) {
    this.#boardContainer = container;
    this.#footer = footer;

    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    const compare = comparersSort[this.#currentSortType];
    const filteredMovies = filterMovies[this.#filterModel.filter]([...this.#movieModel.movies]);

    if (typeof compare === 'function') {
      return filteredMovies.sort(compare);
    } else {
      return filteredMovies;
    }
  }

  get topRatedMovies() {
    return [...this.#movieModel.movies].slice(0).sort(sortMovieByRating);
  }

  get mostCommentMovies() {
    return [...this.#movieModel.movies].slice(0).sort(sortMovieByCommentsCount);
  }

  init = () => this.#renderBoard();

  #renderSort = () => {
    render(this.#sortComponent, this.#boardContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #replaceSort = () => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView();
    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderLoadingList = () => {
    render(this.#loadingListComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadingTotlaCount = () => {
    render(this.#loadingTotalCountComponent, this.#footer);
  };

  #renderTotlaCount = () => {
    render(new FilmStatisticsView(), this.#footer);
  };

  #renderTitle = (movies, container, isTopRated, isMostComment) => {
    render(new FilmsListTitleView(movies, isTopRated, isMostComment, this.#filterModel.filter), container.element, RenderPosition.AFTERBEGIN);
  };

  #replaceMainTitle = (movies) => {
    const prevTitleComponent = this.#mainTitleComponent;
    this.#mainTitleComponent = new FilmsListTitleView(movies, false, false, this.#filterModel.filter);

    if (prevTitleComponent === null) {
      render(this.#mainTitleComponent, this.#mainListComponent.element, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this.#mainListComponent.element.contains(prevTitleComponent.element)) {
      replace(this.#mainTitleComponent, prevTitleComponent);
    }

    remove(prevTitleComponent);
  };

  #renderMovie = (movie, container, presenter) => {
    const moviePresenter = new MoviePresenter(container, this.#handleViewAction, this.#handleModeChange, this.#movieModel, this.#commentsModel);
    moviePresenter.init(movie);
    presenter.set(movie.id, moviePresenter);
  };

  #renderMainMovieList = () => {
    const movieCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(movieCount, MOVIE_COUNT_PER_STEP));

    this.#replaceMainTitle(movies);
    render(this.#mainListComponent, this.#boardComponent.element);
    renderList(movies, this.#renderMovie, this.#mainListComponent, this.#moviePresenter);

    if (movieCount > MOVIE_COUNT_PER_STEP) {
      this.#rendershowMoreButton();
    }

  };

  #replaceMainMovieList = (data) => {
    const movieCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(movieCount, this.#renderedMovieCount));

    let popupMode = 'DEFAULT';
    let position = 0;

    if (data && this.#moviePresenter.get(data.id)) {
      popupMode = this.#moviePresenter.get(data.id).mode;
      position = this.#moviePresenter.get(data.id).position;
      this.#moviePresenter.get(data.id).init(data);
    }

    this.#clearMovieList();
    this.#replaceMainTitle(movies);
    renderList(movies, this.#renderMovie, this.#mainListComponent, this.#moviePresenter);

    if (popupMode !== 'DEFAULT' && this.#moviePresenter.get(data.id)) {
      this.#moviePresenter.get(data.id).initPopup(position);
    }


    if (this.movies.length > this.#renderedMovieCount) {
      this.#rendershowMoreButton();
    }
  };

  #renderTopRatedMovieList = () => {
    const movieCount = this.topRatedMovies.length;
    const movies = this.topRatedMovies.slice(0, Math.min(movieCount, TOP_RATED_MOVIE_COUNT_PER_STEP));

    const sumrRating = movies.reduce((previousValue, currentValue) => previousValue.filmInfo.totalRating + currentValue.filmInfo.totalRating);

    if (movies.length < 2 || sumrRating < 0) {
      return;
    }

    render(this.#topRatedListComponent, this.#boardComponent.element);
    this.#renderTitle(movies, this.#topRatedListComponent, true, false);
    renderList(movies, this.#renderMovie, this.#topRatedListComponent, this.#topRatedMoviePresenter);
  };

  #replaceTopRatedMovieList = (data) => {
    const movieCount = this.topRatedMovies.length;
    const movies = this.topRatedMovies.slice(0, Math.min(movieCount, TOP_RATED_MOVIE_COUNT_PER_STEP));

    if (data && this.#topRatedMoviePresenter.get(data.id)) {
      let topRatedPopupMode = 'DEFAULT';
      let position = 0;
      topRatedPopupMode = this.#topRatedMoviePresenter.get(data.id).mode;
      position = this.#topRatedMoviePresenter.get(data.id).position;
      this.#topRatedMoviePresenter.get(data.id).init(data);

      this.#topRatedMoviePresenter.forEach((presenter) => presenter.destroy());
      this.#topRatedMoviePresenter.clear();
      renderList(movies, this.#renderMovie, this.#topRatedListComponent, this.#topRatedMoviePresenter);

      if (topRatedPopupMode !== 'DEFAULT' && this.#topRatedMoviePresenter.get(data.id)) {
        this.#topRatedMoviePresenter.get(data.id).initPopup(position);
      }
    }
  };

  #renderMostCommentedMovieList = () => {
    const movieCount = this.mostCommentMovies.length;
    const movies = this.mostCommentMovies.slice(0, Math.min(movieCount, MOST_COMMENTED_MOVIE_COUNT_PER_STEP));

    const sumrCommentsCount = movies.reduce((previousValue, currentValue) => previousValue.comments.length + currentValue.comments.length);

    if (movies.length < 2 || sumrCommentsCount < 0) {
      return;
    }

    if (movies.length < 2) {
      return;
    }

    render(this.#mostCommentedListComponent, this.#boardComponent.element);
    this.#renderTitle(movies, this.#mostCommentedListComponent, false, true);
    renderList(movies, this.#renderMovie, this.#mostCommentedListComponent, this.#mostCommentedMoviePresenter);
  };

  #replaceMostCommentedMovieList = (data) => {
    const movieCount = this.mostCommentMovies.length;
    const movies = this.mostCommentMovies.slice(0, Math.min(movieCount, MOST_COMMENTED_MOVIE_COUNT_PER_STEP));

    if (data && this.#mostCommentedMoviePresenter.get(data.id)) {
      let mostCommentedPopupMode = 'DEFAULT';
      let position = 0;
      mostCommentedPopupMode = this.#mostCommentedMoviePresenter.get(data.id).mode;
      position = this.#mostCommentedMoviePresenter.get(data.id).position;
      this.#mostCommentedMoviePresenter.get(data.id).init(data);

      this.#mostCommentedMoviePresenter.forEach((presenter) => presenter.destroy());
      this.#mostCommentedMoviePresenter.clear();
      renderList(movies, this.#renderMovie, this.#mostCommentedListComponent, this.#mostCommentedMoviePresenter);

      if (mostCommentedPopupMode !== 'DEFAULT' && this.#mostCommentedMoviePresenter.get(data.id)) {
        this.#mostCommentedMoviePresenter.get(data.id).initPopup(position);
      }
    }
  };

  #rendershowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#mainListComponent.element);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreClick);
  };

  #renderBoard = () => {
    this.#renderSort();
    render(this.#boardComponent, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoadingList();
      this.#renderLoadingTotlaCount();
      return;
    }

    this.#renderMainMovieList();
    this.#renderTopRatedMovieList();
    this.#renderMostCommentedMovieList();
    this.#renderTotlaCount();
  };

  #clearMovieList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();

    remove(this.#showMoreButtonComponent);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    if (actionType === UserAction.UPDATE_MOVIE) {
      if (this.#moviePresenter.get(update.id)) {
        this.#moviePresenter.get(update.id).setFilmDetailsLoading();
        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#moviePresenter.get(update.id).setAborting();
        }
      }

      if (this.#topRatedMoviePresenter.get(update.id)) {
        this.#topRatedMoviePresenter.get(update.id).setFilmDetailsLoading();

        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#topRatedMoviePresenter.get(update.id).setAborting();
        }
      }

      if (this.#mostCommentedMoviePresenter.get(update.id)) {
        this.#mostCommentedMoviePresenter.get(update.id).setFilmDetailsLoading();
        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#mostCommentedMoviePresenter.get(update.id).setAborting();
        }
      }
    } else if (actionType === UserAction.DELETE_COMMENT) {
      if (this.#moviePresenter.get(update.id)) {
        this.#moviePresenter.get(update.id).setCommentDeleting();
        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#moviePresenter.get(update.id).setAborting();
        }
      }

      if (this.#topRatedMoviePresenter.get(update.id)) {
        this.#topRatedMoviePresenter.get(update.id).setCommentDeleting();

        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#topRatedMoviePresenter.get(update.id).setAborting();
        }
      }

      if (this.#mostCommentedMoviePresenter.get(update.id)) {
        this.#mostCommentedMoviePresenter.get(update.id).setCommentDeleting();

        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#mostCommentedMoviePresenter.get(update.id).setAborting();
        }
      }

    } else if (actionType === UserAction.ADD_COMMENT) {
      if (this.#moviePresenter.get(update.id)) {
        this.#moviePresenter.get(update.id).setCommentAdding();
        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#moviePresenter.get(update.id).setAborting();
        }
      }

      if (this.#topRatedMoviePresenter.get(update.id)) {
        this.#topRatedMoviePresenter.get(update.id).setCommentAdding();

        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#topRatedMoviePresenter.get(update.id).setAborting();
        }
      }

      if (this.#mostCommentedMoviePresenter.get(update.id)) {
        this.#mostCommentedMoviePresenter.get(update.id).setCommentAdding();

        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch (err) {
          this.#mostCommentedMoviePresenter.get(update.id).setAborting();
        }
      }
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    if (updateType === UpdateType.PATCH) {
      const documentPosition = window.pageYOffset;
      this.#replaceSort();

      if (this.#filterModel.filter !== FilterType.ALL) {
        this.#replaceMainMovieList(data);
      }

      if (this.#moviePresenter.get(data.id)) {
        this.#moviePresenter.get(data.id).init(data);
      }

      if (this.#topRatedMoviePresenter.get(data.id)) {
        this.#topRatedMoviePresenter.get(data.id).init(data);
      }

      if (this.#mostCommentedMoviePresenter.get(data.id)) {
        this.#mostCommentedMoviePresenter.get(data.id).init(data);
      }

      window.scrollTo(0, documentPosition);
    } else if (updateType === UpdateType.MINOR) {
      const documentPosition = window.pageYOffset;

      this.#replaceTopRatedMovieList(data);
      this.#replaceMostCommentedMovieList(data);
      this.#replaceMainMovieList(data);

      window.scrollTo(0, documentPosition);
    } else if (updateType === UpdateType.MAJOR) {
      this.#currentSortType = SortType.DEFAULT;
      this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
      this.#replaceSort();
      this.#replaceMainMovieList(data);

    } else if (updateType === UpdateType.INIT) {
      this.#isLoading = false;
      remove(this.#loadingListComponent);
      remove(this.#loadingTotalCountComponent);
      this.#renderBoard();
    }
  };

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
    this.#mostCommentedMoviePresenter.forEach((presenter) => presenter.resetView());
    this.#topRatedMoviePresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearMovieList();

    const movieCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(movieCount, this.#renderedMovieCount));

    renderList(movies, this.#renderMovie, this.#mainListComponent, this.#moviePresenter);

    if (this.movies.length > this.#renderedMovieCount) {
      this.#rendershowMoreButton();
    }
  };

  #handleShowMoreClick = () => {
    const movieCount = this.movies.length;
    const newRenderMovieCount = Math.min(movieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCount, newRenderMovieCount);

    renderList(movies, this.#renderMovie, this.#mainListComponent, this.#moviePresenter);
    this.#renderedMovieCount = newRenderMovieCount;

    if (newRenderMovieCount >= movieCount) {
      remove(this.#showMoreButtonComponent);
    }
  };
}
