import AbstractView from '../framework/view/abstract-view.js';

const getRank = (movies) => {
  let rank = '';
  if (movies.length < 10 && movies.length > 0) {
    rank = 'Novice';
  } else if (movies.length >= 10 && movies.length <= 20) {
    rank = 'Fan';
  } else if (movies.length > 20) {
    rank = 'Movie Buff';
  }

  return rank;
};

const createUserRankTemplate = (movies) => `<section class="header__profile profile"><p class="profile__rating">${getRank(movies)}</p><img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></section>`;

export default class UserRankView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createUserRankTemplate(this.#movies);
  }
}
