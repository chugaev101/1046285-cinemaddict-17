import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';

import { UpdateType, UserAction, ChangeMode } from '../const.js';

export default class MoviePresenter {
  #movieListContainer = null;
  #movieCardComponent = null;
  #movie = null;
  #changeData = null;
  #changeMode = null;
  #ChangeMode = ChangeMode.DEFAULT;
  #position = 0;

  constructor(movieListContainer, changeData, changeMode) {
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  get position() {
    return this.#position;
  }

  init = (movie) => {
    this.#movie = movie;
    const prevMovieComponent = this.#movieCardComponent;

    this.#movieCardComponent = new FilmCardView(this.#movie);
    this.#movieCardComponent.setClickHandler(this.#openPopup);
    this.#movieCardComponent.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#movieCardComponent.setClickAsWatchedHandler(this.#handleAsWatchedClick);
    this.#movieCardComponent.setClickFavoriteHandler(this.#handleFavoriteClick);
    if (prevMovieComponent === null) {
      render(this.#movieCardComponent, this.#movieListContainer.element.children[1]);
      return;
    }

    if (this.#movieListContainer.element.children[1].contains(prevMovieComponent.element)) {
      replace(this.#movieCardComponent, prevMovieComponent);
    }

    remove(prevMovieComponent);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
  };

  setFilmDetailsLoading = () => {
    if (this.#ChangeMode === ChangeMode.LOADING) {
      this.#movieCardComponent.updateElement({
        isDisabled: true,
      });
    }
  };

  setAborting = () => {
    if (this.#ChangeMode === ChangeMode.LOADING) {
      this.#movieCardComponent.shake();
    }
  };

  #openPopup = () => {
    this.#changeMode(ChangeMode.OPEN_POPUP, this.#movie.id);
  };

  #handleWatchlistClick = () => {
    this.#ChangeMode = ChangeMode.LOADING;

    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, { ...this.#movie, userDetails: { ...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist } });
  };

  #handleAsWatchedClick = () => {
    this.#ChangeMode = ChangeMode.LOADING;

    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, { ...this.#movie, userDetails: { ...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched } });
  };

  #handleFavoriteClick = () => {
    this.#ChangeMode = ChangeMode.LOADING;

    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, { ...this.#movie, userDetails: { ...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite } });
  };
}
