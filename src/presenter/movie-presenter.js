import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';

import PopupContainerView from '../view/popup-container-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPEN: 'OPEN',
};

export default class MoviePresenter {
  #movieListContainer = null;
  #movieCardComponent = null;
  #commentsContainerComponent = null;
  #movie = null;
  #comments = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  #popupContainerComponent = new PopupContainerView();
  #filmInfoComponent = null;

  constructor(movieListContainer, comments, changeData, changeMode) {
    this.#movieListContainer = movieListContainer;
    this.#comments = comments;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (movie) => {
    this.#movie = movie;
    const prevMovieComponent = this.#movieCardComponent;

    this.#movieCardComponent = new FilmCardView(this.#movie);
    this.#filmInfoComponent = new PopupFilmDetailsView(this.#movie);
    this.#commentsContainerComponent = new PopupCommentsView(this.#movie, this.#comments);

    this.#movieCardComponent.setClickHandler(this.#handleShowPopup);
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

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#handleHidePopup();
    }
  };

  #handleShowPopup = () => {
    if (this.#filmInfoComponent) {
      this.#handleHidePopup();
    }

    render(this.#popupContainerComponent, document.body);
    render(this.#filmInfoComponent, this.#popupContainerComponent.element.firstChild);
    render(this.#commentsContainerComponent, this.#popupContainerComponent.element.firstChild);

    this.#filmInfoComponent.setClickWatchlistHandler(this.#handlePopupWatchlistClick);
    this.#filmInfoComponent.setClickAsWatchedHandler(this.#handlePopupAsWatchedClick);
    this.#filmInfoComponent.setClickFavoriteHandler(this.#handlePopupFavoriteClick);
    this.#filmInfoComponent.setClickHandler(this.#handleHidePopup);
    document.addEventListener('keydown', this.#escDownHandler);
    document.body.classList.add('hide-overflow');

    this.#changeMode();
    this.#mode = Mode.OPEN;
  };

  #handleHidePopup = () => {
    remove(this.#popupContainerComponent);
    remove(this.#filmInfoComponent);
    remove(this.#commentsContainerComponent);

    document.body.classList.remove('hide-overflow');

    this.#filmInfoComponent.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#handleHidePopup);

    document.removeEventListener('keydown', this.#escDownHandler);

    this.#mode = Mode.DEFAULT;
  };

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleHidePopup();
    }
  };

  #handleWatchlistClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
  };

  #handleAsWatchedClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
  };

  #handlePopupWatchlistClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
    this.#handleShowPopup(this.#movie, this.#movie.comments);
  };

  #handlePopupAsWatchedClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
    this.#handleShowPopup(this.#movie, this.#movie.comments);
  };

  #handlePopupFavoriteClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
    this.#handleShowPopup(this.#movie, this.#movie.comments);
  };
}
