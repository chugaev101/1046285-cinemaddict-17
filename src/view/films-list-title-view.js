import AbstractView  from '../framework/view/abstract-view.js';

const createTitleTemplate = (movies) => {
  let title = '';
  let hiddenClass;

  if (!movies.length) {
    title = 'There are no movies in our database';
  } else {
    hiddenClass = 'visually-hidden';
  }

  return `<h2 class="films-list__title ${hiddenClass}">${title}</h2>`;
};

export default class FilmsBoardView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createTitleTemplate(this.#movies);
  }
}
