import { createElement } from '../render.js';
import { humanizeLongDate } from '../utils.js';

const createDetailsTemplate = (movie) => {
  const { id, film_info: filmInfo, user_details: userDetails } = movie;
  const { title, total_rating: totalRating, poster, age_rating: ageRating, director, writers, actors, release, runtime, genre, description } = filmInfo;
  const { date, release_country: releaseCountry } = release;
  const { watchlist, already_watched: alreadyWatched, favorite } = userDetails;

  const toggleFilmControls = (control) => control === true ? 'film-details__control-button--active' : '';

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
              <td class="film-details__cell">${runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">${genre}</td>
            </tr>
          </table>
      
          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>
      
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${toggleFilmControls(watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched ${toggleFilmControls(alreadyWatched)}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${toggleFilmControls(favorite)}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`
  );
};

export default class PopupFilmDetailsView {
  constructor(movie) {
    this.movie = movie;
  }

  getTemplate() {
    return createDetailsTemplate(this.movie);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
