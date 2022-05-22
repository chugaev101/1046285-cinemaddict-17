import AbstractView  from '../framework/view/abstract-view.js';
import { humanizeShortDate } from '../utils.js';

const createCardTemplate = (movie) => {
  const { id, comments, filmInfo, userDetails } = movie;
  const { title, totalRating, poster, release, runtime, genre, description } = filmInfo;
  const { date } = release;
  const { watchlist, alreadyWatched, favorite } = userDetails;

  const toggleFilmControls = (control) => control === true ? 'film-card__controls-item--active' : '';

  return (
    `<article class="film-card" data-id="${id}">
        <a class="film-card__link">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${totalRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${humanizeShortDate(date)}</span>
            <span class="film-card__duration">${runtime}</span>
            <span class="film-card__genre">${genre}</span>
          </p>
          <img src="${poster}" alt="${title}" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <span class="film-card__comments">${comments.length} comments</span>
        </a>
        <div class="film-card__controls">
          <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${toggleFilmControls(watchlist)}" type="button">Add to watchlist</button>
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${toggleFilmControls(alreadyWatched)}" type="button">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite ${toggleFilmControls(favorite)}" type="button">Mark as favorite</button>
        </div>
      </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #movie = null;
  #addToWatchlistButton = null;
  #markToAsWatchedButton = null;
  #addToFavoriteButton = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createCardTemplate(this.#movie);
  }

  setClickHandler = (callback) =>  {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.parentElement.classList.contains('film-card__controls')) {
      return;
    }

    this._callback.click();
  };

  setClickWatchlistHandler = (callback) =>  {
    this.#addToWatchlistButton = this.element.querySelector('.film-card__controls-item--add-to-watchlist');
    this._callback.clickWatchlist = callback;
    this.#addToWatchlistButton.addEventListener('click', this.#clickAddToWatchlistHandler);
  };

  setClickAsWatchedHandler = (callback) =>  {
    this.#markToAsWatchedButton = this.element.querySelector('.film-card__controls-item--mark-as-watched');
    this._callback.clickAsWatched = callback;
    this.#markToAsWatchedButton.addEventListener('click', this.#clickMarkToAsWatchedHandler);
  };

  setClickFavoriteHandler = (callback) =>  {
    this.#addToFavoriteButton = this.element.querySelector('.film-card__controls-item--favorite');
    this._callback.clickFavorite = callback;
    this.#addToFavoriteButton.addEventListener('click', this.#clickAddToFavoriteHandler);
  };

  #clickAddToWatchlistHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickWatchlist();
  };

  #clickMarkToAsWatchedHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickAsWatched();
  };

  #clickAddToFavoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickFavorite();
  };
}
