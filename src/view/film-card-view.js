import AbstractView  from '../framework/view/abstract-view.js';
import { humanizeShortDate } from '../utils.js';

const createCardTemplate = (movie) => {
  const { id, comments, film_info: filmInfo, user_details: userDetails } = movie;
  const { title, total_rating: totalRating, poster, release, runtime, genre, description } = filmInfo;
  const { date } = release;
  const { watchlist, already_watched: alreadyWatched, favorite } = userDetails;

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

    if (evt.target.parentElement.classList.contains('film-card__controls')) return; 

    this._callback.click();
  };
}
