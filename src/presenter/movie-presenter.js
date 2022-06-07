import { render, remove, replace } from '../framework/render.js';
import { sortCommentsByDate } from '../utils.js';
import FilmCardView from '../view/film-card-view.js';

import PopupContainerView from '../view/popup-container-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';

import { UpdateType } from '../const.js';

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

  #popupContainerComponent = null;
  #filmInfoComponent = null;

  constructor(movieListContainer, comments, changeData, changeMode) {
    this.#movieListContainer = movieListContainer;
    this.#comments = comments.sort(sortCommentsByDate);
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (movie) => {
    this.#movie = movie;
    const prevMovieComponent = this.#movieCardComponent;

    this.#movieCardComponent = new FilmCardView(this.#movie);
    this.#movieCardComponent.setClickHandler(this.#renderPopup);
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

    if (this.#mode !== Mode.DEFAULT) {
      this.#renderFilmDetails();
      this.#renderFilmDetails();
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

  #renderPopup = () => {
    if (this.#mode === Mode.OPEN) {
      return;
    }

    this.#popupContainerComponent = new PopupContainerView();
    this.#filmInfoComponent = new PopupFilmDetailsView(this.#movie);
    this.#commentsContainerComponent = new PopupCommentsView(this.#movie, this.#comments);

    this.#renderFilmDetails(this.#movie);
    this.#renderComments(this.#movie, this.#comments);


    render(this.#popupContainerComponent, document.body);
    render(this.#commentsContainerComponent, this.#popupContainerComponent.element.firstChild);

    document.addEventListener('keydown', this.#escDownHandler);

    document.body.classList.add('hide-overflow');

    this.#changeMode();
    this.#mode = Mode.OPEN;
  };

  #renderFilmDetails = () => {
    if (this.#mode !== Mode.DEFAULT) {
      const prevFilmDetailsComponent = this.#filmInfoComponent;
      this.#filmInfoComponent = new PopupFilmDetailsView(this.#movie);

      replace(this.#filmInfoComponent, prevFilmDetailsComponent);
      this.#filmInfoComponent.setClickWatchlistHandler(this.#handleWatchlistClick);
      this.#filmInfoComponent.setClickAsWatchedHandler(this.#handleAsWatchedClick);
      this.#filmInfoComponent.setClickFavoriteHandler(this.#handleFavoriteClick);
      this.#filmInfoComponent.setClickHandler(this.#handleHidePopup);

      remove(prevFilmDetailsComponent);
      return;
    }

    render(this.#filmInfoComponent, this.#popupContainerComponent.element.firstChild);

    this.#filmInfoComponent.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#filmInfoComponent.setClickAsWatchedHandler(this.#handleAsWatchedClick);
    this.#filmInfoComponent.setClickFavoriteHandler(this.#handleFavoriteClick);
    this.#filmInfoComponent.setClickHandler(this.#handleHidePopup);
  };

  #renderComments = () => {
    if (this.#mode !== Mode.DEFAULT) {
      const prevCommentsComponent = this.#commentsContainerComponent;
      this.#commentsContainerComponent = new PopupCommentsView(this.#movie, this.#comments);

      replace(this.#commentsContainerComponent, prevCommentsComponent);

      this.#commentsContainerComponent.setAddCommentHandler(this.#handleAddComment);
      this.#commentsContainerComponent.setDeleteCommentHandler(this.#handleDeleteComment);

      remove(prevCommentsComponent);
      return;
    }

    this.#commentsContainerComponent.setAddCommentHandler(this.#handleAddComment);
    this.#commentsContainerComponent.setDeleteCommentHandler(this.#handleDeleteComment);
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
    this.#changeData(UpdateType.MINOR, { ...this.#movie, userDetails: { ...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist } });
  };

  #handleAsWatchedClick = () => {
    this.#changeData(UpdateType.MINOR, { ...this.#movie, userDetails: { ...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched } });
  };

  #handleFavoriteClick = () => {
    this.#changeData(UpdateType.MINOR, { ...this.#movie, userDetails: { ...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite } });
  };

  #handleAddComment = () => {

  };

  #handleDeleteComment = () => {

  };
}
