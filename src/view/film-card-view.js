import { createElement } from '../render.js';
import { humanizeShortDate } from '../utils.js';

const createCardTemplate = (movie) => {
  const { id, comments, film_info, user_details } = movie;
  const { title, total_rating, poster, release, runtime, genre, description } = film_info;
  const { date } = release;
  const { watchlist, already_watched, favorite } = user_details;

  const toggleFilmControls = (control) => control === true ? 'film-card__controls-item--active' : '';

  return (
    `<article class="film-card" data-id="${id}">
        <a class="film-card__link">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${total_rating}</p>
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
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${toggleFilmControls(already_watched)}" type="button">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite ${toggleFilmControls(favorite)}" type="button">Mark as favorite</button>
        </div>
      </article>`
  )
};

export default class FilmCardView {
  constructor(movie) {
    this.movie = movie;
  }

  getTemplate() {
    return createCardTemplate(this.movie);
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
