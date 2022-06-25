import { render, remove, replace } from '../framework/render.js';
import { sortCommentsByDate } from '../utils.js';
import PopupContainerView from '../view/popup-container-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';
import { UpdateType, UserAction, ChangeMode } from '../const.js';

export default class PopupPresenter {
  #movieModel = null;
  #commentsModel = null;

  #popupContainerComponent = null;
  #commentsContainerComponent = null;
  #filmInfoComponent = null;

  #movie = null;
  #movieId = null;
  #comments = null;

  #changeData = null;
  #changeMode = null;
  #ChangeMode = ChangeMode.DEFAULT;

  constructor(movieModel, commentsModel, changeData, changeMode) {
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;

    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  init = (movieId) => {
    this.#movieId = movieId;
    this.#movie = this.#movieModel.movies.find((movie) => movie.id === movieId);
    const prevPopupContainerComponent = this.#popupContainerComponent;
    this.#popupContainerComponent = new PopupContainerView();

    if (prevPopupContainerComponent === null) {
      render(this.#popupContainerComponent, document.body);
      this.#renderFilmDetails(this.#movie);
    } else if (document.body.contains(prevPopupContainerComponent.element)) {
      replace(this.#popupContainerComponent, prevPopupContainerComponent);
    }

    this.#commentsModel.init(this.#movieId);

    document.addEventListener('keydown', this.#escDownHandler);
    document.body.classList.add('hide-overflow');

    remove(prevPopupContainerComponent);
  };

  get movieId () {
    return this.#movieId;
  }

  setFilmDetailsLoading = () => {
    if (this.#ChangeMode === ChangeMode.LOADING) {
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

  destroy = () => {
    remove(this.#popupContainerComponent);
    remove(this.#commentsContainerComponent);
    remove(this.#filmInfoComponent);
  };

  #renderFilmDetails = (movie) => {
    const prevfilmInfoComponent = this.#filmInfoComponent;
    this.#filmInfoComponent = new PopupFilmDetailsView(movie);

    if (prevfilmInfoComponent === null) {
      render(this.#filmInfoComponent, this.#popupContainerComponent.element.firstChild);
    } else if (this.#popupContainerComponent.element.firstChild.contains(prevfilmInfoComponent.element)) {
      replace(this.#filmInfoComponent, prevfilmInfoComponent);
    }

    this.#filmInfoComponent.setClickWatchlistHandler(this.#handleWatchlistClick);
    this.#filmInfoComponent.setClickAsWatchedHandler(this.#handleAsWatchedClick);
    this.#filmInfoComponent.setClickFavoriteHandler(this.#handleFavoriteClick);
    this.#filmInfoComponent.setClickHandler(this.#closeButtonHandler);

    remove(prevfilmInfoComponent);
  };

  #renderComments = (comments) => {
    const prevCommentsContainerComponent = this.#commentsContainerComponent;
    this.#commentsContainerComponent = new PopupCommentsView(this.#movie, comments);

    if (prevCommentsContainerComponent === null) {
      render(this.#commentsContainerComponent, this.#popupContainerComponent.element.firstChild);
    } else if (this.#popupContainerComponent.element.firstChild.contains(prevCommentsContainerComponent.element)) {
      replace(this.#commentsContainerComponent, prevCommentsContainerComponent);
    }

    this.#commentsContainerComponent.setAddCommentHandler(this.#handleAddComment);
    this.#commentsContainerComponent.setDeleteCommentHandler(this.#handleDeleteComment);

    remove(prevCommentsContainerComponent);
  };

  #hidePopup = () => {
    document.body.classList.remove('hide-overflow');

    this.#filmInfoComponent.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#hidePopup);

    document.removeEventListener('keydown', this.#escDownHandler);
    this.#changeMode(ChangeMode.HIDE_POPUP);
  };

  #handleModelEvent = (updateType, update) => {
    if (updateType === UpdateType.INIT_COMMENTS) {
      this.#comments = this.#commentsModel.comments.sort(sortCommentsByDate);
      this.#renderComments(this.#comments);
    } else if (updateType === UpdateType.PATCH) {
      this.#movie = this.#movieModel.movies.find((movie) => movie.id === update.id);
      this.#comments = this.#commentsModel.comments.sort(sortCommentsByDate);
      this.#renderComments(this.#comments);
      this.#renderFilmDetails(this.#movie);
    }
  };

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hidePopup();
    }
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

  #closeButtonHandler = () => {
    this.#hidePopup();
  };
}
