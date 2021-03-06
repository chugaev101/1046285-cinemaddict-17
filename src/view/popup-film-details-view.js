import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeLongDate, formatMinutesToRuntime } from '../utils.js';

const createDetailsTemplate = (movie) => {
  const { id, filmInfo, userDetails, isDisabled } = movie;
  const { title, totalRating, poster, ageRating, director, writers, actors, release, runtime, genre, description } = filmInfo;
  const { date, releaseCountry } = release;
  const { watchlist, alreadyWatched, favorite } = userDetails;

  let slicedDescription = description;

  if (description.length > 140) {
    slicedDescription = `${slicedDescription.slice(0, 139)}...`;
  }

  const toggleFilmControls = (control) => control ? 'film-details__control-button--active' : '';

  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap" data-id="${id}">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">
      
          <p class="film-details__age">${ageRating}</p>
        </div>
      
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>
      
            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>
      
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${humanizeLongDate(date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatMinutesToRuntime(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">${genre}</td>
            </tr>
          </table>
      
          <p class="film-details__film-description">
          ${slicedDescription}
          </p>
        </div>
      </div>
      
      <section class="film-details__controls" style="${isDisabled ? 'pointer-events: none;' : ''}">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${toggleFilmControls(watchlist)}" data-type="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${toggleFilmControls(alreadyWatched)}" data-type="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${toggleFilmControls(favorite)}" data-type="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`
  );
};

export default class PopupFilmDetailsView extends AbstractStatefulView {
  #addToWatchlistButton = null;
  #markToAsWatchedButton = null;
  #addToFavoriteButton = null;

  constructor(movie) {
    super();
    this._state = PopupFilmDetailsView.parseMovieToState(movie);

    this.#setInnerHandlers();
  }

  get template() {
    return createDetailsTemplate(this._state);
  }

  static parseMovieToState = (movie) => ({
    ...movie,
    isDisabled: false,
  });

  static parseStateToMovie = (state) => {
    const movie = {...state};

    delete movie.isDisabled;

    return movie;
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  setClickWatchlistHandler = (callback) => {
    this.#addToWatchlistButton = this.element.querySelector('.film-details__control-button--watchlist');
    this._callback.clickWatchlist = callback;
    this.#addToWatchlistButton.addEventListener('click', this.#clickAddToWatchlistHandler);
  };

  setClickAsWatchedHandler = (callback) => {
    this.#markToAsWatchedButton = this.element.querySelector('.film-details__control-button--watched');
    this._callback.clickAsWatched = callback;
    this.#markToAsWatchedButton.addEventListener('click', this.#clickMarkToAsWatchedHandler);
  };

  setClickFavoriteHandler = (callback) => {
    this.#addToFavoriteButton = this.element.querySelector('.film-details__control-button--favorite');
    this._callback.clickFavorite = callback;
    this.#addToFavoriteButton.addEventListener('click', this.#clickAddToFavoriteHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  reset = (movie) => {
    this.updateElement(
      PopupFilmDetailsView.parseMovieToState(movie),
    );
  };

  #setInnerHandlers = () => {
    this.#addToWatchlistButton = this.element.querySelector('.film-details__control-button--watchlist');
    this.#addToWatchlistButton.addEventListener('click', this.#clickAddToWatchlistHandler);

    this.#markToAsWatchedButton = this.element.querySelector('.film-details__control-button--watched');
    this.#markToAsWatchedButton.addEventListener('click', this.#clickMarkToAsWatchedHandler);

    this.#addToFavoriteButton = this.element.querySelector('.film-details__control-button--favorite');
    this.#addToFavoriteButton.addEventListener('click', this.#clickAddToFavoriteHandler);

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.parentElement.classList.contains('film-card__controls')) {
      return;
    }

    this._callback.click();
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
