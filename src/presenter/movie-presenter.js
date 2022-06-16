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

  constructor(movieListContainer, comments, changeData, changeMode, commentsModel) {
    this.#movieListContainer = movieListContainer;
    this.#comments = comments.sort(sortCommentsByDate);
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
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
      this.#handleHidePopup();
    }
  };

  initPopup = (position) => {
    this.#renderPopup(position);
    this.#mode = Mode.OPEN;
  };

  #renderPopup = (position = 0) => {
    this.#popupContainerComponent = new PopupContainerView();

    render(this.#popupContainerComponent, document.body);

    this.#renderFilmDetails(this.#movie);
    this.#renderComments(this.#movie, this.#comments);

    document.addEventListener('keydown', this.#escDownHandler);

    document.body.classList.add('hide-overflow');

    this.#popupContainerComponent.element.scrollTop = position;

    this.#changeMode();
    this.#mode = Mode.OPEN;
  };

  #renderFilmDetails = () => {
    this.#filmInfoComponent = new PopupFilmDetailsView(this.#movie);

    this.#filmInfoComponent.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#filmInfoComponent.setClickAsWatchedHandler(this.#handleAsWatchedClick);
    this.#filmInfoComponent.setClickFavoriteHandler(this.#handleFavoriteClick);
    this.#filmInfoComponent.setClickHandler(this.#handleHidePopup);

    render(this.#filmInfoComponent, this.#popupContainerComponent.element.firstChild);
  };

  #renderComments = () => {
    this.#commentsContainerComponent = new PopupCommentsView(this.#movie, this.#comments);

    render(this.#commentsContainerComponent, this.#popupContainerComponent.element.firstChild);

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
    if (this.#popupContainerComponent) {
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }

    this.#changeData(UpdateType.MINOR, { ...this.#movie, userDetails: { ...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist } });
  };

  #handleAsWatchedClick = () => {
    if (this.#popupContainerComponent) {
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }

    this.#changeData(UpdateType.MINOR, { ...this.#movie, userDetails: { ...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched } });
  };

  #handleFavoriteClick = () => {
    if (this.#popupContainerComponent) {
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }

    this.#changeData(UpdateType.MINOR, { ...this.#movie, userDetails: { ...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite } });
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
