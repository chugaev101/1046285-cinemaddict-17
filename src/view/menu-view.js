import AbstractView  from '../framework/view/abstract-view.js';

const createMenuTemplate = (movies) => {
  let countViewed = 0;
  let countWatchlist = 0;
  let countFavorite = 0;

  movies.forEach((movie) => {
    const details = movie.user_details;

    if (details.already_watched) {
      countViewed++;
    } 
    if (details.watchlist) {
      countWatchlist++;
    } 
    if (details.favorite) {
      countFavorite++;
    }
  });

  return (
    `<nav class="main-navigation">
          <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
          <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${countWatchlist}</span></a>
          <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${countViewed}</span></a>
          <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${countFavorite}</span></a>
      </nav>`
  )
};

export default class MenuView extends AbstractView {
  #movies = null;

  constructor (movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createMenuTemplate(this.#movies);
  }
}
