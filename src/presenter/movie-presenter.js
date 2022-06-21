import { render, remove, replace } from '../framework/render.js';
import { sortCommentsByDate } from '../utils.js';

import FilmCardView from '../view/film-card-view.js';
import PopupContainerView from '../view/popup-container-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';

import { UpdateType, UserAction } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPEN: 'OPEN',
};

const ChangeMode = {
  DEFAULT: 'DEFAULT',
  LOADING: 'LOADING',
  ADDING: 'ADDING',
  DELETING: 'DELETING',
};

export default class MoviePresenter {
  #movieListContainer = null;
  #movieCardComponent = null;
  #commentsContainerComponent = null;
  #movie = null;
  #movieId = null;
  #comments = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #ChangeMode = ChangeMode.DEFAULT;
  #position = 0;

  #popupContainerComponent = null;
  #filmInfoComponent = null;

  #movieModel = null;
  #commentsModel = null;

  constructor(movieListContainer, changeData, changeMode, movieModel, commentsModel) {
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;

    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  init = (movie) => {
    this.#movie = movie;
    this.#movieId = movie.id;
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
      this.#mode = Mode.DEFAULT;
    }
  };

  setFilmDetailsLoading = () => {
    if (this.#ChangeMode === ChangeMode.LOADING && this.#mode !== Mode.DEFAULT) {
      this.#filmInfoComponent.updateElement({
        isDisabled: true,
      });
    }
  };

  setCommentDeleting = () => {
    if (this.#ChangeMode === ChangeMode.DELETING) {
      this.#commentsContainerComponent.updateElement({
        isCommentDeleting: true,
      });
    }
  };

  setCommentAdding = () => {
    if (this.#ChangeMode === ChangeMode.ADDING) {
      this.#commentsContainerComponent.updateElement({
        isCommentAdding: true,
      });
    }
  };

  setAborting = () => {
    if (this.#ChangeMode === ChangeMode.LOADING) {
      const resetFilmDetailsState = () => {
        this.#filmInfoComponent.updateElement({
          isDisabled: false,
        });
      };

      this.#filmInfoComponent.shake(resetFilmDetailsState);
    } else if (this.#ChangeMode === ChangeMode.DELETING) {
      const resetCommentsState = () => {
        this.#commentsContainerComponent.updateElement({
          isCommentDeleting: false,
        });
      };

      this.#commentsContainerComponent.shake(resetCommentsState);

    } else if (this.#ChangeMode === ChangeMode.ADDING) {
      const resetCommentsState = () => {
        this.#commentsContainerComponent.updateElement({
          isCommentAdding: false,
        });
        this.#commentsContainerComponent.restoreFocus();
      };

      this.#commentsContainerComponent.shake(resetCommentsState);
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
    this.#commentsModel.init(this.#movieId);
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

  #replaceComments = (comments) => {
    const prevCommentsContainerComponent = this.#commentsContainerComponent;
    this.#commentsContainerComponent = new PopupCommentsView(this.#movie, comments);

    if (prevCommentsContainerComponent === null) {
      render(this.#commentsContainerComponent, this.#popupContainerComponent.element.firstChild);

      this.#commentsContainerComponent.setAddCommentHandler(this.#handleAddComment);
      this.#commentsContainerComponent.setDeleteCommentHandler(this.#handleDeleteComment);
      return;
    }

    if (this.#popupContainerComponent.element.firstChild.contains(prevCommentsContainerComponent.element)) {
      replace(this.#commentsContainerComponent, prevCommentsContainerComponent);
    }

    this.#commentsContainerComponent.setAddCommentHandler(this.#handleAddComment);
    this.#commentsContainerComponent.setDeleteCommentHandler(this.#handleDeleteComment);

    remove(prevCommentsContainerComponent);
  };

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.INIT_COMMENTS && this.#mode !== Mode.DEFAULT) {
      this.#comments = this.#commentsModel.comments.sort(sortCommentsByDate);
      this.#renderComments(this.#comments);
    } else if (updateType === UpdateType.PATCH && this.#mode !== Mode.DEFAULT) {
      this.#comments = this.#commentsModel.comments.sort(sortCommentsByDate);
      this.#filmInfoComponent.reset(this.#movie);
      this.#commentsContainerComponent.reset(this.#movie, this.#comments);
      this.#replaceFilmDetails();
      this.#replaceComments(this.#comments);
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }
  };

  #closeButtonHandler = () => {
    this.#hidePopup();
    this.#mode = Mode.DEFAULT;
    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, this.#movie);
  };

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hidePopup();
      this.#mode = Mode.DEFAULT;
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, this.#movie);
    }
  };

  #handleWatchlistClick = () => {
    if (this.#popupContainerComponent) {
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }

    this.#ChangeMode = ChangeMode.LOADING;

    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, { ...this.#movie, userDetails: { ...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist } });
  };

  #handleAsWatchedClick = () => {
    if (this.#popupContainerComponent) {
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }

    this.#ChangeMode = ChangeMode.LOADING;

    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, { ...this.#movie, userDetails: { ...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched } });
  };

  #handleFavoriteClick = () => {
    if (this.#popupContainerComponent) {
      this.#position = this.#popupContainerComponent.element.scrollTop;
    }

    this.#ChangeMode = ChangeMode.LOADING;

    this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, { ...this.#movie, userDetails: { ...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite } });
  };

  #handleAddComment = (comment, emotion) => {
    const newComment = {
      comment: comment,
      emotion: emotion,
    };

    this.#ChangeMode = ChangeMode.ADDING;
    this.#commentsModel.addComment(UpdateType.PATCH, newComment, this.#movie);
    this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, this.#movie);
  };

  #handleDeleteComment = (id) => {
    const targetComment = this.#comments.find((comment) => comment.id === id);
    this.#ChangeMode = ChangeMode.DELETING;
    this.#commentsModel.deleteComment(UpdateType.PATCH, targetComment, this.#movie);
    this.#changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, this.#movie);
  };
}
