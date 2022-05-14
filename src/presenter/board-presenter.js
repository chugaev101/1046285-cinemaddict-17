import {RenderPosition, render, remove} from '../framework/render.js';
import MenuView from '../view/menu-view.js';
import SortView from '../view/sort-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTitleView from '../view/films-list-title-view.js';
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
  #movieModel = null;
  #topRatedMovieModel = null;
  #mostCommentedMovieModel = null;
  #commentsModel = null;
  
  #boardContainer = null;
  #movieComponent = null;
  #boardComponent = new FilmsBoardView();
  #mainListComponent = new FilmsListView();
  #topRatedListComponent = new FilmsListView(true);
  #mostCommentedListComponent = new FilmsListView(true);

  #popupContainerComponent = new PopupContainerView();
  #formComponent = new PopupFormView();
  #filmInfoComponent = null;
  #commentsTitleComponent = null;
  #commentsContainerComponent = new PopupCommentsView();
  #commentsWrap = null;
  #newCommentComponent = new PopupNewCommentView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #boardMovies = [];
  #topRatedMovies = [];
  #mostCommentedMovies = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  constructor(container, movieModel, topRatedMovieModel, mostCommentedMovieModel, commentsModel) {
    this.#boardContainer = container;
    this.#movieModel = movieModel;
    this.#topRatedMovieModel = topRatedMovieModel;
    this.#mostCommentedMovieModel = mostCommentedMovieModel;
    this.#commentsModel = commentsModel;
  }

  get comments() {
    return [...this.#commentsModel.comments];
  }

  init = () => {
    this.#boardMovies = [...this.#movieModel.movies];
    this.#topRatedMovies = [...this.#topRatedMovieModel.movies];
    this.#mostCommentedMovies = [...this.#mostCommentedMovieModel.movies];

    render(new MenuView(this.#boardMovies), this.#boardContainer);
    render(new SortView(), this.#boardContainer);
    render(this.#boardComponent, this.#boardContainer);
    render(this.#mainListComponent, this.#boardComponent.element);
    render(this.#topRatedListComponent, this.#boardComponent.element);
    render(this.#mostCommentedListComponent, this.#boardComponent.element);

    this.#renderTitle(this.#boardMovies, this.#mainListComponent);
    this.#renderTitle(this.#topRatedMovies, this.#topRatedListComponent, true);
    this.#renderTitle(this.#mostCommentedMovies, this.#mostCommentedListComponent, false, true);

    for (let i = 0; i < Math.min(this.#boardMovies.length, MOVIE_COUNT_PER_STEP); i++) {
      this.#renderMovie(this.#boardMovies[i], this.#mainListComponent);
    }

    this.#topRatedMovies.forEach((movie) => this.#renderMovie(movie, this.#topRatedListComponent));
    this.#mostCommentedMovies.forEach((movie) => this.#renderMovie(movie, this.#mostCommentedListComponent));

    if (this.#boardMovies.length > MOVIE_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#mainListComponent.element);

      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreClick);
    }
  };

  #renderTitle = (movies, container, isTopRated, isMostComment) => {
    render(new FilmsListTitleView(movies, isTopRated, isMostComment), container.element, RenderPosition.AFTERBEGIN);
  };

  #renderMovie = (movie, container) => {
    this.#movieComponent = new FilmCardView(movie);

    const showPopup = () => this.#renderPopup(movie, movie.comments);

    this.#movieComponent.setClickHandler(showPopup);

    render(this.#movieComponent, container.element.children[1]);
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

  #renderPopup = (movie, commentsIds) => {
    if (this.#filmInfoComponent) {
      this.#hidePopup();
    }

    this.#filmInfoComponent = new PopupFilmDetailsView(movie);
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
