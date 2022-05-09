import {RenderPosition, render, remove} from '../framework/render.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTitleView from '../view/films-list-title-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

import PopupContainerView from '../view/popup-container-view.js';
import PopupFormView from '../view/popup-form-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupCommentsView from '../view/popup-comments-container-view.js';
import PopupCommentsTitleView from '../view/popup-comments-title-view.js';
import PopupCommentView from '../view/popup-comment-view.js';
import PopupNewCommentView from '../view/popup-new-comment-view.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardContainer = null;
  #movieModel = null;
  #movieComponent = null;
  #commentsModel = null;
  #boardComponent = new FilmsBoardView();
  #listComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();

  #popupContainerComponent = new PopupContainerView();
  #formComponent = new PopupFormView();
  #filmInfoComponent = null;
  #commentsTitleComponent = null;
  #commentsContainerComponent = new PopupCommentsView();
  #commentsWrap = null;
  #newCommentComponent = new PopupNewCommentView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #boardMovies = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  constructor(container, movieModel, commentsModel) {
    this.#boardContainer = container;
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
  }

  get comments() {
    return [...this.#commentsModel.comments];
  }

  init = () => {
    this.#boardMovies = [...this.#movieModel.movies];

    render(this.#boardComponent, this.#boardContainer);
    render(this.#listComponent, this.#boardComponent.element);
    render(new FilmsListTitleView(this.#boardMovies), this.#listComponent.element);
    render(this.#filmsContainerComponent, this.#listComponent.element);

    for (let i = 0; i < Math.min(this.#boardMovies.length, MOVIE_COUNT_PER_STEP); i++) {
      this.#renderMovie(this.#boardMovies[i]);
    }

    if (this.#boardMovies.length > MOVIE_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#listComponent.element);

      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreClick);
    }
  };

  #handleShowMoreClick = () => {
    this.#boardMovies
      .slice(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#boardMovies.length) remove(this.#showMoreButtonComponent);
  };

  #renderMovie = (movie) => {
    this.#movieComponent = new FilmCardView(movie);

    const showPopup = () => this.#renderPopup(movie, movie.comments);

    this.#movieComponent.setClickHandler(showPopup);

    render(this.#movieComponent, this.#filmsContainerComponent.element);
  };

  #renderPopup = (movie, commentsIds) => {
    if (this.#filmInfoComponent) this.#hidePopup();

    this.#filmInfoComponent = new PopupFilmDetailsView(movie);
    console.log(this.#commentsContainerComponent)
    this.#commentsWrap = this.#commentsContainerComponent.element.querySelector('.film-details__comments-list');

    render(this.#popupContainerComponent, document.body);
    render(this.#formComponent, this.#popupContainerComponent.element);
    render(this.#filmInfoComponent, this.#formComponent.element);
    render(this.#commentsContainerComponent, this.#formComponent.element);

    document.body.classList.add('hide-overflow');

    let commentsCount = 0;

    for (const comment of this.comments) {
      if (commentsIds.includes(comment.id)) {
        this.#renderComment(comment);
        commentsCount++;
      }
    }

    render(this.#newCommentComponent, this.#commentsWrap);

    this.#commentsTitleComponent = new PopupCommentsTitleView(commentsCount);
    render(this.#commentsTitleComponent, this.#commentsContainerComponent.element, RenderPosition.AFTERBEGIN);

    this.#filmInfoComponent.setClickHandler(this.#hidePopup);

    document.addEventListener('keydown', this.#escDownHandler);
  };

  #hidePopup = () => {
    remove(this.#popupContainerComponent);
    remove(this.#formComponent);
    remove(this.#filmInfoComponent);
    remove(this.#commentsTitleComponent);
    remove(this.#commentsContainerComponent);
    remove(this.#newCommentComponent);

    document.body.classList.remove('hide-overflow');

    this.#filmInfoComponent.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#hidePopup);

    document.removeEventListener('keydown', this.#escDownHandler);
  };

  #renderComment = (comment) => {
    const commentComponent = new PopupCommentView(comment);

    render(commentComponent, this.#commentsWrap);
  };

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hidePopup();
    }
  };
}
