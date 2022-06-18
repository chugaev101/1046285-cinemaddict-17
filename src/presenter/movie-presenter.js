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
  #position = 0;

  #popupContainerComponent = null;
  #filmInfoComponent = null;

  #commentsModel = null;

  constructor(movieListContainer, changeData, changeMode, commentsModel) {
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;

    this.#commentsModel.addObserver(this.#handleModelEvent);
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

    remove(prevMovieComponent);
  };

  get mode() {
    return this.#mode;
  }

  get position() {
    return this.#position;
  }

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#popupContainerComponent);
    remove(this.#filmInfoComponent);
    remove(this.#commentsContainerComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#hidePopup();
    }
  };

  initPopup = (position) => {
    this.#renderPopup(position);
  };

  #renderPopup = (position = 0) => {
    this.#changeMode();
    this.#popupContainerComponent = new PopupContainerView();
    render(this.#popupContainerComponent, document.body);
    this.#renderFilmDetails();

    document.addEventListener('keydown', this.#escDownHandler);
    document.body.classList.add('hide-overflow');

    this.#popupContainerComponent.element.scrollTop = position;

    this.#mode = Mode.OPEN;
    this.#commentsModel.init(this.#movie);
  };

  #hidePopup = () => {
    remove(this.#commentsContainerComponent);
    remove(this.#filmInfoComponent);
    remove(this.#popupContainerComponent);

    document.body.classList.remove('hide-overflow');

    this.#filmInfoComponent.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#hidePopup);

    document.removeEventListener('keydown', this.#escDownHandler);
  };

  #renderFilmDetails = () => {
    this.#filmInfoComponent = new PopupFilmDetailsView(this.#movie);

    render(this.#filmInfoComponent, this.#popupContainerComponent.element.firstChild);
    this.#filmInfoComponent.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#filmInfoComponent.setClickAsWatchedHandler(this.#handleAsWatchedClick);
    this.#filmInfoComponent.setClickFavoriteHandler(this.#handleFavoriteClick);
    this.#filmInfoComponent.setClickHandler(this.#closeButtonHandler);
  };

  #replaceFilmDetails = () => {
    const prevfilmInfoComponent = this.#filmInfoComponent;
    this.#filmInfoComponent = new PopupFilmDetailsView(this.#movie);
    replace(this.#filmInfoComponent, prevfilmInfoComponent);

    this.#filmInfoComponent.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#filmInfoComponent.setClickAsWatchedHandler(this.#handleAsWatchedClick);
    this.#filmInfoComponent.setClickFavoriteHandler(this.#handleFavoriteClick);
    this.#filmInfoComponent.setClickHandler(this.#hidePopup);

    remove(prevfilmInfoComponent);
  };

  #renderComments = (comments) => {
    this.#commentsContainerComponent = new PopupCommentsView(this.#movie, comments);

    render(this.#commentsContainerComponent, this.#popupContainerComponent.element.firstChild);

    this.#commentsContainerComponent.setAddCommentHandler(this.#handleAddComment);
    this.#commentsContainerComponent.setDeleteCommentHandler(this.#handleDeleteComment);
  };

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.INIT_COMMENTS) {
      this.#comments = this.#commentsModel.comments.sort(sortCommentsByDate);
      this.#renderComments(this.#comments);
    }
  };

  #closeButtonHandler = () => {
    this.#hidePopup();
    this.#mode = Mode.DEFAULT;
  };

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hidePopup();
      this.#mode = Mode.DEFAULT;
    }
  };

  #handleWatchlistClick = () => {
    if (this.#popupContainerComponent) {
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }

    this.#changeData(UpdateType.PATCH, { ...this.#movie, userDetails: { ...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist } });
    if (this.#mode === Mode.OPEN) {
      this.#replaceFilmDetails();
    }
  };

  #handleAsWatchedClick = () => {
    if (this.#popupContainerComponent) {
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }

    this.#changeData(UpdateType.PATCH, { ...this.#movie, userDetails: { ...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched } });
    if (this.#mode === Mode.OPEN) {
      this.#replaceFilmDetails();
    }
  };

  #handleFavoriteClick = () => {
    if (this.#popupContainerComponent) {
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }

    this.#changeData(UpdateType.PATCH, { ...this.#movie, userDetails: { ...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite } });
    if (this.#mode === Mode.OPEN) {
      this.#replaceFilmDetails();
    }
  };

  #handleAddComment = (id, author, comment, date, emotion) => {
    this.#position = this.#popupContainerComponent.element.scrollTop;

    const newComment = {
      id: id,
      author: author,
      comment: comment,
      date: date,
      emotion: emotion,
    };

    this.#movie.comments.push(newComment.id);

    this.#commentsModel.addComment(UpdateType.PATCH, newComment);
    this.#changeData(UpdateType.MINOR, this.#movie);
  };

  #handleDeleteComment = (id) => {
    this.#position = this.#popupContainerComponent.element.scrollTop;

    this.#commentsModel.comments.forEach((comment) => {
      if (`${comment.id}` === id) {
        const index = this.#movie.comments.findIndex((commentItem) => `${commentItem}` === id);

        if (index >= 0) {
          this.#movie.comments.splice(index, 1);
          this.#commentsModel.deleteComment(UpdateType.PATCH, comment);
          this.#changeData(UpdateType.MINOR, this.#movie);
        }
      }
    });

    // this.#changeMode();
    this.#mode = Mode.OPEN;
  };
}
